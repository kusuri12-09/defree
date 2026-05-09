import { Injectable, NotFoundException } from '@nestjs/common'
import { RecipesRepository } from './recipes.repository'
import { IngredientsRepository } from '../ingredients/ingredients.repository'

@Injectable()
export class RecipesService {
  constructor(
    private readonly recipesRepository: RecipesRepository,
    private readonly ingredientsRepository: IngredientsRepository,
  ) {}

  async getRecommendations(
    userId: string,
    options: {
      includePartial?: boolean
      maxMissingIngredients?: number
      cookTimeMax?: number
      limit?: number
    },
  ) {
    const { includePartial = true, maxMissingIngredients = 2, cookTimeMax, limit = 10 } = options

    const ownedIngredients = await this.ingredientsRepository.findAllActive(userId)
    const ownedNames = new Set(ownedIngredients.map((i) => i.name))

    // 보유 재료 이름으로 관련 레시피 조회
    const matchedIngredientRows = await this.recipesRepository.findByIngredientNames([
      ...ownedNames,
    ])
    const recipeIdSet = new Set(matchedIngredientRows.map((r) => r.recipeId))
    const recipeIds = [...recipeIdSet]

    if (recipeIds.length === 0) return { canMakeNow: [], nearlyPossible: [] }

    const allRecipeIngredients = await this.recipesRepository.findIngredientsByRecipeIds(recipeIds)

    const recipeIngredientMap = new Map<string, typeof allRecipeIngredients>()
    for (const ri of allRecipeIngredients) {
      const list = recipeIngredientMap.get(ri.recipeId) ?? []
      list.push(ri)
      recipeIngredientMap.set(ri.recipeId, list)
    }

    const expiringSoon = ownedIngredients.filter((i) => {
      const dDay = i.calculateDDay()
      return dDay >= 0 && dDay <= 2
    })
    const expiringNames = new Set(expiringSoon.map((i) => i.name))

    const canMakeNow: object[] = []
    const nearlyPossible: object[] = []

    for (const recipeId of recipeIds.slice(0, limit * 3)) {
      const required = recipeIngredientMap.get(recipeId) ?? []
      const missing = required.filter((r) => !r.isOptional && !ownedNames.has(r.ingredientName))
      const matched = required.filter((r) => ownedNames.has(r.ingredientName))
      const usesExpiring = matched.some((r) => expiringNames.has(r.ingredientName))
      const expiringUsed = expiringSoon
        .filter((i) => matched.some((r) => r.ingredientName === i.name))
        .map((i) => ({ name: i.name, dDay: i.calculateDDay() }))

      const recipe = matchedIngredientRows.find((r) => r.recipeId === recipeId)?.recipe
      if (!recipe) continue
      if (cookTimeMax && recipe.cookTimeMinutes && recipe.cookTimeMinutes > cookTimeMax) continue

      const card = {
        id: recipe.id,
        title: recipe.title,
        source: recipe.source,
        servings: recipe.servings,
        cookTimeMinutes: recipe.cookTimeMinutes,
        thumbnailUrl: recipe.thumbnailUrl,
        sourceUrl: recipe.sourceUrl,
        youtubeUrl: recipe.youtubeUrl,
        matchedIngredients: matched.map((r) => r.ingredientName),
        missingIngredients: missing.map((r) => r.ingredientName),
        missingCount: missing.length,
        usesExpiringIngredients: usesExpiring,
        expiringIngredients: expiringUsed,
      }

      if (missing.length === 0) {
        canMakeNow.push(card)
      } else if (includePartial && missing.length <= maxMissingIngredients) {
        nearlyPossible.push(card)
      }
    }

    // 유통기한 임박 재료 사용 레시피 상단 정렬
    canMakeNow.sort(
      (a: any, b: any) => (b.usesExpiringIngredients ? 1 : 0) - (a.usesExpiringIngredients ? 1 : 0),
    )

    return {
      canMakeNow: canMakeNow.slice(0, limit),
      nearlyPossible: nearlyPossible.slice(0, limit),
    }
  }

  async getDetail(id: string, userId: string) {
    const recipe = await this.recipesRepository.findById(id)
    if (!recipe) throw new NotFoundException('NOT_FOUND')

    const ownedIngredients = await this.ingredientsRepository.findAllActive(userId)
    const ownedMap = new Map(ownedIngredients.map((i) => [i.name, i]))
    const recipeIngredients = await this.recipesRepository.findIngredientsByRecipeId(id)

    return {
      ...recipe,
      ingredients: recipeIngredients.map((ri) => {
        const owned = ownedMap.get(ri.ingredientName)
        return {
          ingredientName: ri.ingredientName,
          quantity: ri.quantity,
          unit: ri.unit,
          isOptional: ri.isOptional,
          isSeasoning: ri.isSeasoning,
          ownedQuantity: owned ? Number(owned.quantity) : 0,
          ownedUnit: owned?.unit ?? ri.unit,
          isOwned: !!owned,
        }
      }),
      chainRecommendation: null, // TODO: 연쇄 추천 로직
    }
  }
}
