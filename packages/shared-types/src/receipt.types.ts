export type ReceiptStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface ReceiptItemDto {
  receiptItemId: string
  rawName: string
  normalizedName: string | null
  quantity: number
  unit: string
  suggestedExpiryDays: number
  suggestedExpiryDate: string
  categoryId: number
  categoryName: string
  isConfirmed: boolean
}

export interface ReceiptScanResponseDto {
  receiptId: string
  status: ReceiptStatus
  scannedAt?: string
  completedAt?: string
  errorMessage?: string
  items?: ReceiptItemDto[] | null
}

export interface ConfirmReceiptItemDto {
  receiptItemId: string
  normalizedName: string
  categoryId: number
  quantity: number
  unit: string
  purchaseDate: string
  expiryDate: string
}

export interface ConfirmReceiptDto {
  items: ConfirmReceiptItemDto[]
}

export interface ConfirmedIngredientDto {
  id: string
  name: string
  quantity: number
  unit: string
  expiryDate: string
  dDay: number
}

export interface ConfirmReceiptResponseDto {
  savedCount: number
  ingredients: ConfirmedIngredientDto[]
}

export interface ReceiptSummaryDto {
  id: string
  status: ReceiptStatus
  itemCount: number
  imageUrl: string
  scannedAt: string
  completedAt: string | null
}
