import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NormalizedReceiptItem, OcrPipelineError, ReceiptOcrPipeline } from '@defree/ocr'
import { ReceiptsRepository } from './receipts.repository'
import { IngredientsRepository } from '../ingredients/ingredients.repository'
import { IngredientCategoriesService } from '../ingredient-categories/ingredient-categories.service'
import { ConfirmReceiptDto } from './dto/confirm-receipt.dto'
import { ReceiptItem } from './entities/receipt-item.entity'

@Injectable()
export class ReceiptsService {
  constructor(
    private readonly receiptsRepository: ReceiptsRepository,
    private readonly ingredientsRepository: IngredientsRepository,
    private readonly categoriesService: IngredientCategoriesService,
    private readonly configService: ConfigService,
  ) {}

  async createScanEntry(userId: string, imageUrl: string) {
    const receipt = this.receiptsRepository.createReceipt({ userId, imageUrl, status: 'pending' })
    return this.receiptsRepository.saveReceipt(receipt)
  }

  async scanReceipt(userId: string, file: Express.Multer.File) {
    const receipt = await this.createScanEntry(
      userId,
      `upload://receipts/${Date.now()}-${file.originalname}`,
    )

    void this.processReceiptImage(receipt.id, file).catch(async (error: unknown) => {
      const latest = await this.receiptsRepository.findReceiptById(receipt.id)
      if (!latest) return
      latest.markAsFailed(toPipelineErrorMessage(error))
      await this.receiptsRepository.saveReceipt(latest)
    })

    return receipt
  }

  private async processReceiptImage(receiptId: string, file: Express.Multer.File) {
    const receipt = await this.receiptsRepository.findReceiptById(receiptId)
    if (!receipt) throw new NotFoundException('NOT_FOUND')

    receipt.markAsProcessing()
    await this.receiptsRepository.saveReceipt(receipt)

    try {
      const pipeline = new ReceiptOcrPipeline({
        clovaApiKey: this.configService.get<string>('CLOVA_OCR_API_KEY'),
        clovaInvokeUrl: this.configService.get<string>('CLOVA_OCR_INVOKE_URL'),
        openAiApiKey: this.configService.get<string>('OPENAI_API_KEY'),
        openAiModel: this.configService.get<string>('OPENAI_MODEL'),
      })

      const result = await pipeline.process({
        imageBuffer: file.buffer,
        mimeType: file.mimetype,
        filename: file.originalname,
      })

      await this.receiptsRepository.deleteItemsByReceiptId(receipt.id)
      const items = result.items.map((item) => this.toReceiptItem(receipt.id, item))
      await this.receiptsRepository.saveItems(items)

      receipt.ocrRawText = result.rawText
      receipt.markAsCompleted()
      await this.receiptsRepository.saveReceipt(receipt)
    } catch (error) {
      receipt.markAsFailed(toPipelineErrorMessage(error))
      await this.receiptsRepository.saveReceipt(receipt)

      if (error instanceof OcrPipelineError) {
        throw new BadGatewayException({ code: error.code, message: error.message })
      }
      throw error
    }
  }

  async findByIdAndUserId(receiptId: string, userId: string) {
    const receipt = await this.receiptsRepository.findReceiptByIdAndUserId(receiptId, userId)
    if (!receipt) throw new NotFoundException('NOT_FOUND')
    return receipt
  }

  async getResultWithItems(receiptId: string, userId: string) {
    const receipt = await this.findByIdAndUserId(receiptId, userId)
    const categories = await this.categoriesService.findAll()
    const items =
      receipt.status === 'completed'
        ? (await this.receiptsRepository.findItemsByReceiptId(receiptId)).map((item) => {
            const category = findCategoryForName(item.normalizedName ?? item.rawName, categories)
            const suggestedExpiryDays = category.defaultExpiryDays
            return {
              receiptItemId: item.id,
              rawName: item.rawName,
              normalizedName: item.normalizedName,
              quantity: Number(item.quantity),
              unit: item.unit,
              suggestedExpiryDays,
              suggestedExpiryDate: addDays(new Date(), suggestedExpiryDays),
              categoryId: category.id,
              categoryName: category.name,
              isConfirmed: item.isConfirmed,
            }
          })
        : null
    return { receipt, items }
  }

  async confirmAndSave(receiptId: string, userId: string, dto: ConfirmReceiptDto) {
    const receipt = await this.findByIdAndUserId(receiptId, userId)

    const savedIngredients = await Promise.all(
      dto.items.map(async (item) => {
        const ingredient = this.ingredientsRepository.create({
          userId,
          name: item.normalizedName,
          categoryId: item.categoryId,
          quantity: item.quantity,
          unit: item.unit,
          purchaseDate: item.purchaseDate,
          expiryDate: item.expiryDate,
          source: 'ocr',
          status: 'active',
          receiptItemId: item.receiptItemId,
        })
        const saved = await this.ingredientsRepository.save(ingredient)

        const receiptItem =
          (await this.receiptsRepository.findItemByIdAndReceiptId(
            item.receiptItemId,
            receipt.id,
          )) ??
          this.receiptsRepository.createItem({
            id: item.receiptItemId,
            receiptId: receipt.id,
            rawName: item.normalizedName,
          })

        receiptItem.normalizedName = item.normalizedName
        receiptItem.quantity = item.quantity
        receiptItem.unit = item.unit
        receiptItem.isConfirmed = true
        receiptItem.ingredientId = saved.id
        await this.receiptsRepository.saveItem(receiptItem)

        return {
          id: saved.id,
          name: saved.name,
          quantity: saved.quantity,
          unit: saved.unit,
          expiryDate: saved.expiryDate,
          dDay: saved.calculateDDay(),
        }
      }),
    )

    return { savedCount: savedIngredients.length, ingredients: savedIngredients }
  }

  async findAllByUser(userId: string, page = 1, limit = 20) {
    const [receipts, total] = await this.receiptsRepository.findAllByUserId(userId, page, limit)
    return { receipts, total, page, limit }
  }

  private toReceiptItem(receiptId: string, item: NormalizedReceiptItem): ReceiptItem {
    return this.receiptsRepository.createItem({
      receiptId,
      rawName: item.rawName,
      normalizedName: item.normalizedName,
      quantity: item.quantity,
      unit: item.unit,
      isConfirmed: false,
    })
  }
}

interface CategoryLike {
  id: number
  name: string
  defaultExpiryDays: number
}

function toPipelineErrorMessage(error: unknown): string {
  if (error instanceof OcrPipelineError) return `${error.code}: ${error.message}`
  if (error instanceof Error) return error.message
  return 'OCR_PIPELINE_FAILED'
}

function addDays(baseDate: Date, days: number): string {
  const date = new Date(baseDate)
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

function findCategoryForName(name: string, categories: CategoryLike[]): CategoryLike {
  const inferredName = inferCategoryName(name)
  return (
    categories.find((category) => category.name === inferredName) ??
    categories.find((category) => category.name === '가공식품') ??
    categories[0]
  )
}

function inferCategoryName(name: string): string {
  if (/(상추|시금치|깻잎|양상추|샐러드|배추|청경채|부추)/.test(name)) return '잎채소'
  if (/(두부|콩|콩나물|숙주)/.test(name)) return '두부·콩류'
  if (/(소고기|돼지|닭|계육|삼겹|목살|다짐육|고기)/.test(name)) return '육류'
  if (/(당근|감자|고구마|양파|대파|마늘|무|버섯)/.test(name)) return '근채류'
  if (/(계란|달걀|특란|왕란)/.test(name)) return '계란'
  if (/(우유|치즈|요거트|요구르트|버터|크림)/.test(name)) return '유제품'
  if (/(간장|고추장|된장|소금|설탕|식초|소스|참기름|케첩|마요)/.test(name)) return '소스·양념'
  return '가공식품'
}
