import { Injectable, NotFoundException } from '@nestjs/common'
import { ReceiptsRepository } from './receipts.repository'
import { IngredientsRepository } from '../ingredients/ingredients.repository'
import { IngredientCategoriesService } from '../ingredient-categories/ingredient-categories.service'
import { ConfirmReceiptDto } from './dto/confirm-receipt.dto'

@Injectable()
export class ReceiptsService {
  constructor(
    private readonly receiptsRepository: ReceiptsRepository,
    private readonly ingredientsRepository: IngredientsRepository,
    private readonly categoriesService: IngredientCategoriesService,
  ) {}

  async createScanEntry(userId: string, imageUrl: string) {
    const receipt = this.receiptsRepository.createReceipt({ userId, imageUrl, status: 'pending' })
    return this.receiptsRepository.saveReceipt(receipt)
  }

  async findByIdAndUserId(receiptId: string, userId: string) {
    const receipt = await this.receiptsRepository.findReceiptByIdAndUserId(receiptId, userId)
    if (!receipt) throw new NotFoundException('NOT_FOUND')
    return receipt
  }

  async getResultWithItems(receiptId: string, userId: string) {
    const receipt = await this.findByIdAndUserId(receiptId, userId)
    const items =
      receipt.status === 'completed'
        ? await this.receiptsRepository.findItemsByReceiptId(receiptId)
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

        const receiptItem = await this.receiptsRepository.createItem({
          receiptId: receipt.id,
          rawName: item.normalizedName,
          normalizedName: item.normalizedName,
          quantity: item.quantity,
          unit: item.unit,
          isConfirmed: true,
          ingredientId: saved.id,
        })
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
}
