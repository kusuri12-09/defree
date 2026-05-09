export interface IngredientCategoryDto {
  id: number
  name: string
  iconEmoji: string
  defaultExpiryDays: number
  notificationLeadDays: number
  canFreeze: boolean
  frozenExpiryDays: number | null
  singleServingUnit: string
}
