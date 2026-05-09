export type RecipeSource = 'mangae' | 'youtube' | 'gpt'

export interface RecipeIngredientDto {
  ingredientName: string
  quantity: number
  unit: string
  isOptional: boolean
  isSeasoning: boolean
  ownedQuantity: number
  ownedUnit: string
  isOwned: boolean
}

export interface RecipeDto {
  id: string
  title: string
  source: RecipeSource
  servings: number
  cookTimeMinutes: number | null
  thumbnailUrl: string | null
  sourceUrl: string | null
  youtubeUrl: string | null
  description: string | null
}

export interface RecipeCardDto extends RecipeDto {
  matchedIngredients: string[]
  missingIngredients: string[]
  missingCount: number
  usesExpiringIngredients: boolean
  expiringIngredients: Array<{ name: string; dDay: number }>
}

export interface ChainRecipeDto {
  id: string
  title: string
  cookTimeMinutes: number | null
  thumbnailUrl: string | null
  description: string | null
}

export interface RecipeDetailDto extends RecipeDto {
  ingredients: RecipeIngredientDto[]
  chainRecommendation: ChainRecipeDto | null
  cachedAt: string
}

export interface RecipeRecommendationsDto {
  canMakeNow: RecipeCardDto[]
  nearlyPossible: RecipeCardDto[]
}

export interface RecipeRecommendationQueryDto {
  includePartial?: boolean
  maxMissingIngredients?: number
  cookTimeMax?: number
  limit?: number
}
