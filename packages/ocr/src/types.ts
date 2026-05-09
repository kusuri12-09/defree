export interface ReceiptOcrPipelineOptions {
  clovaApiKey?: string
  clovaInvokeUrl?: string
  openAiApiKey?: string
  openAiModel?: string
}

export interface ReceiptOcrPipelineInput {
  imageBuffer: Buffer
  mimeType: string
  filename?: string
}

export interface ReceiptItemCandidate {
  rawName: string
  quantity: number
  unit: string
}

export interface NormalizedReceiptItem extends ReceiptItemCandidate {
  normalizedName: string
  categoryName: string
}

export interface ReceiptOcrPipelineResult {
  rawText: string
  items: NormalizedReceiptItem[]
}

export class OcrPipelineError extends Error {
  constructor(
    message: string,
    readonly code: 'OCR_SERVICE_ERROR' | 'LLM_SERVICE_ERROR' | 'OCR_PARSE_EMPTY',
  ) {
    super(message)
  }
}
