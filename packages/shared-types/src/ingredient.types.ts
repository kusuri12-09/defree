export type IngredientStatus = 'active' | 'consumed' | 'expired' | 'discarded'
export type IngredientSource = 'ocr' | 'manual' | 'digital'
export type IngredientSortField = 'expiryDate' | 'createdAt' | 'name'

export interface IngredientCategorySnapshotDto {
  id: number
  name: string
  iconEmoji: string
}

export interface IngredientDto {
  id: string
  name: string
  category: IngredientCategorySnapshotDto
  quantity: number
  unit: string
  purchaseDate: string
  expiryDate: string
  dDay: number
  isFrozen: boolean
  frozenAt: string | null
  status: IngredientStatus
  source: IngredientSource
  createdAt: string
  updatedAt: string
}

export interface CreateIngredientDto {
  name: string
  categoryId: number
  quantity: number
  unit: string
  purchaseDate: string
  expiryDate: string
}

export interface UpdateIngredientDto {
  name?: string
  categoryId?: number
  quantity?: number
  unit?: string
  purchaseDate?: string
  expiryDate?: string
  status?: Extract<IngredientStatus, 'consumed' | 'discarded'>
}

export interface FreezeIngredientDto {
  isFrozen: boolean
}

export interface IngredientQueryDto {
  status?: IngredientStatus
  categoryId?: number
  expiringWithin?: number
  sort?: IngredientSortField
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}
