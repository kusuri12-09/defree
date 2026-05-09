export interface UsedIngredientDto {
  ingredientId: string | null
  ingredientName: string
  quantityUsed: number
  unit: string
}

export interface CreateCookingLogDto {
  recipeId?: string | null
  servingsCooked: number
  usedIngredients: UsedIngredientDto[]
}

export interface DeductedIngredientDto {
  ingredientId: string
  name: string
  previousQuantity: number
  usedQuantity: number
  remainingQuantity: number
  unit: string
  status: string
}

export interface CookingLogResponseDto {
  cookingLogId: string
  recipeTitle: string | null
  servingsCooked: number
  cookedAt: string
  deductedIngredients: DeductedIngredientDto[]
}
