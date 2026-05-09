export type CommercePlatform = 'coupang' | 'kurly' | 'bmart'
export type ShoppingItemSource = 'auto' | 'manual'

export interface ShoppingListItemDto {
  id: string
  ingredientName: string
  quantity: number
  unit: string
  isSmallPackage: boolean
  commerceUrl: string | null
  commercePlatform: CommercePlatform | null
  source: ShoppingItemSource
  isPurchased: boolean
}

export interface ShoppingListDto {
  id: string
  isActive: boolean
  createdAt: string
  summary: string | null
  items: ShoppingListItemDto[]
}

export interface CreateShoppingItemDto {
  ingredientName: string
  quantity: number
  unit: string
}

export interface UpdateShoppingItemDto {
  isPurchased?: boolean
  quantity?: number
  unit?: string
}

export interface CompleteShoppingResponseDto {
  completedAt: string
  purchasedCount: number
  message: string
}
