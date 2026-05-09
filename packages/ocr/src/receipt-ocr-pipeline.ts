import {
  NormalizedReceiptItem,
  OcrPipelineError,
  ReceiptItemCandidate,
  ReceiptOcrPipelineInput,
  ReceiptOcrPipelineOptions,
  ReceiptOcrPipelineResult,
} from './types'

const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini'
const DEFAULT_CATEGORY = '가공식품'
const CATEGORY_NAMES = [
  '잎채소',
  '두부·콩류',
  '육류',
  '근채류',
  '계란',
  '유제품',
  '가공식품',
  '소스·양념',
]

interface ClovaOcrField {
  inferText?: string
  lineBreak?: boolean
}

interface ClovaOcrResponse {
  images?: Array<{
    fields?: ClovaOcrField[]
  }>
}

interface OpenAiChatResponse {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
}

interface NormalizedPayloadItem {
  rawName?: string
  normalizedName?: string
  categoryName?: string
  quantity?: number
  unit?: string
}

export class ReceiptOcrPipeline {
  constructor(private readonly options: ReceiptOcrPipelineOptions) {}

  async process(input: ReceiptOcrPipelineInput): Promise<ReceiptOcrPipelineResult> {
    const rawText = await this.extractText(input)
    const candidates = parseReceiptCandidates(rawText)

    if (candidates.length === 0) {
      throw new OcrPipelineError('영수증에서 식재료 후보를 찾지 못했습니다.', 'OCR_PARSE_EMPTY')
    }

    const items = await this.normalizeItems(candidates)
    return { rawText, items }
  }

  private async extractText(input: ReceiptOcrPipelineInput): Promise<string> {
    const { clovaApiKey, clovaInvokeUrl } = this.options
    if (!clovaApiKey || !clovaInvokeUrl) {
      throw new OcrPipelineError('Clova OCR 환경 변수가 설정되지 않았습니다.', 'OCR_SERVICE_ERROR')
    }

    const format = mimeTypeToClovaFormat(input.mimeType)
    const response = await fetch(clovaInvokeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OCR-SECRET': clovaApiKey,
      },
      body: JSON.stringify({
        version: 'V2',
        requestId: crypto.randomUUID(),
        timestamp: Date.now(),
        images: [
          {
            format,
            name: input.filename ?? `receipt.${format}`,
            data: input.imageBuffer.toString('base64'),
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new OcrPipelineError(`Clova OCR 요청 실패: ${response.status}`, 'OCR_SERVICE_ERROR')
    }

    const data = (await response.json()) as ClovaOcrResponse
    const fields = data.images?.flatMap((image) => image.fields ?? []) ?? []
    const rawText = fields
      .map((field) => field.inferText?.trim() ?? '')
      .filter(Boolean)
      .join('\n')

    if (!rawText) {
      throw new OcrPipelineError('Clova OCR 결과가 비어 있습니다.', 'OCR_PARSE_EMPTY')
    }

    return rawText
  }

  private async normalizeItems(
    candidates: ReceiptItemCandidate[],
  ): Promise<NormalizedReceiptItem[]> {
    const { openAiApiKey } = this.options
    if (!openAiApiKey) {
      return candidates.map((candidate) => ({
        ...candidate,
        normalizedName: fallbackNormalizeName(candidate.rawName),
        categoryName: inferCategoryName(candidate.rawName),
      }))
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.options.openAiModel ?? DEFAULT_OPENAI_MODEL,
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              '너는 한국 마트 영수증 품목명을 냉장고 재고용 표준 식재료명으로 정규화한다. JSON만 반환한다.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              rules: [
                'rawName의 브랜드명, 행사명, 용량 표기, 괄호 코드는 제거한다.',
                'normalizedName은 사용자가 알아볼 수 있는 짧은 식재료명으로 쓴다.',
                `categoryName은 다음 중 하나만 쓴다: ${CATEGORY_NAMES.join(', ')}`,
                'quantity와 unit은 입력값을 유지하되 명백히 잘못된 경우만 보정한다.',
              ],
              items: candidates,
              outputSchema: {
                items: [
                  {
                    rawName: 'string',
                    normalizedName: 'string',
                    categoryName: CATEGORY_NAMES[0],
                    quantity: 1,
                    unit: '개',
                  },
                ],
              },
            }),
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new OcrPipelineError(`OpenAI 정규화 요청 실패: ${response.status}`, 'LLM_SERVICE_ERROR')
    }

    const data = (await response.json()) as OpenAiChatResponse
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      throw new OcrPipelineError('OpenAI 정규화 결과가 비어 있습니다.', 'LLM_SERVICE_ERROR')
    }

    const parsed = JSON.parse(content) as { items?: NormalizedPayloadItem[] }
    const normalizedItems = parsed.items ?? []

    return candidates.map((candidate) => {
      const matched =
        normalizedItems.find((item) => item.rawName === candidate.rawName) ??
        normalizedItems.find(
          (item) =>
            fallbackNormalizeName(item.rawName ?? '') === fallbackNormalizeName(candidate.rawName),
        )

      return {
        rawName: candidate.rawName,
        normalizedName:
          sanitizeName(matched?.normalizedName) || fallbackNormalizeName(candidate.rawName),
        categoryName:
          normalizeCategoryName(matched?.categoryName) ?? inferCategoryName(candidate.rawName),
        quantity: normalizePositiveNumber(matched?.quantity) ?? candidate.quantity,
        unit: sanitizeUnit(matched?.unit) || candidate.unit,
      }
    })
  }
}

export function parseReceiptCandidates(rawText: string): ReceiptItemCandidate[] {
  const candidates = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .map(cleanReceiptLine)
    .filter((line) => line.length >= 2)
    .filter(isLikelyProductLine)
    .map(toCandidate)
    .filter((item): item is ReceiptItemCandidate => item !== null)

  return dedupeCandidates(candidates).slice(0, 40)
}

function cleanReceiptLine(line: string): string {
  return line
    .replace(/[|]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^[*·\-\s]+/, '')
    .trim()
}

function isLikelyProductLine(line: string): boolean {
  const lower = line.toLowerCase()
  const blocked = [
    '합계',
    '총액',
    '과세',
    '부가세',
    '카드',
    '승인',
    '결제',
    '현금',
    '거스름',
    '영수증',
    '사업자',
    '대표',
    '전화',
    '주소',
    '포인트',
    '적립',
    '할인',
    '면세',
    '공급가',
    '받을금액',
    '받은금액',
    'change',
    'total',
  ]

  if (blocked.some((keyword) => lower.includes(keyword))) return false
  if (/^\d[\d,\s.-]*$/.test(line)) return false
  if (/\d{2,4}[./-]\d{1,2}[./-]\d{1,2}/.test(line)) return false
  if (/^\(?\d{2,4}\)?[-\s]\d{3,4}[-\s]\d{4}$/.test(line)) return false
  return /[가-힣A-Za-z]/.test(line)
}

function toCandidate(line: string): ReceiptItemCandidate | null {
  const withoutBarcode = line.replace(/\b\d{8,14}\b/g, ' ')
  const priceTrimmed = withoutBarcode
    .replace(/\s+\d{1,3}(,\d{3})+(\s*원?)?$/g, '')
    .replace(/\s+\d{3,7}(\s*원?)?$/g, '')
    .trim()

  const quantityMatch =
    priceTrimmed.match(
      /(?:^|\s)(\d+(?:\.\d+)?)\s*(개|봉|팩|병|캔|구|입|장|줄|모|단|g|kg|ml|l)(?=$|\s)/i,
    ) ?? priceTrimmed.match(/[xX*]\s*(\d+(?:\.\d+)?)/)

  const quantity = normalizePositiveNumber(quantityMatch?.[1]) ?? 1
  const unit = sanitizeUnit(quantityMatch?.[2]) || inferUnit(priceTrimmed)
  const rawName = sanitizeName(
    priceTrimmed
      .replace(
        /(?:^|\s)\d+(?:\.\d+)?\s*(개|봉|팩|병|캔|구|입|장|줄|모|단|g|kg|ml|l)(?=$|\s)/gi,
        ' ',
      )
      .replace(/[xX*]\s*\d+(?:\.\d+)?/g, ' '),
  )

  if (!rawName || rawName.length < 2) return null
  return { rawName, quantity, unit }
}

function dedupeCandidates(items: ReceiptItemCandidate[]): ReceiptItemCandidate[] {
  const seen = new Set<string>()
  return items.filter((item) => {
    const key = `${fallbackNormalizeName(item.rawName)}:${item.quantity}:${item.unit}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function fallbackNormalizeName(rawName: string): string {
  return sanitizeName(
    rawName
      .replace(/\([^)]*\)/g, ' ')
      .replace(/\[[^\]]*]/g, ' ')
      .replace(/\d+(?:\.\d+)?\s*(g|kg|ml|l|개입|입|개|봉|팩|병|캔|구)$/gi, ' ')
      .replace(/^[가-힣A-Za-z]{1,3}[)]/g, ' '),
  )
}

function inferUnit(value: string): string {
  if (/\d+\s*(g|kg)(?=$|\s)/i.test(value)) return 'g'
  if (/\d+\s*(ml|l)(?=$|\s)/i.test(value)) return 'ml'
  if (/(계란|달걀)/.test(value)) return '구'
  if (/(대파|쪽파|시금치|상추|깻잎)/.test(value)) return '단'
  if (/(두부)/.test(value)) return '모'
  return '개'
}

function inferCategoryName(rawName: string): string {
  if (/(상추|시금치|깻잎|양상추|샐러드|배추|청경채|부추)/.test(rawName)) return '잎채소'
  if (/(두부|콩|콩나물|숙주)/.test(rawName)) return '두부·콩류'
  if (/(소고기|돼지|닭|계육|삼겹|목살|다짐육|고기)/.test(rawName)) return '육류'
  if (/(당근|감자|고구마|양파|대파|마늘|무|버섯)/.test(rawName)) return '근채류'
  if (/(계란|달걀|특란|왕란)/.test(rawName)) return '계란'
  if (/(우유|치즈|요거트|요구르트|버터|크림)/.test(rawName)) return '유제품'
  if (/(간장|고추장|된장|소금|설탕|식초|소스|참기름|케첩|마요)/.test(rawName)) return '소스·양념'
  return DEFAULT_CATEGORY
}

function normalizeCategoryName(categoryName?: string): string | null {
  if (!categoryName) return null
  return CATEGORY_NAMES.includes(categoryName) ? categoryName : null
}

function normalizePositiveNumber(value?: string | number): number | null {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function sanitizeName(value?: string): string {
  return (value ?? '')
    .replace(/[^\p{L}\p{N}\s·]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100)
}

function sanitizeUnit(value?: string): string {
  return (value ?? '').replace(/[^가-힣A-Za-z]/g, '').slice(0, 20)
}

function mimeTypeToClovaFormat(mimeType: string): string {
  if (mimeType === 'image/png') return 'png'
  if (mimeType === 'image/webp') return 'webp'
  return 'jpg'
}
