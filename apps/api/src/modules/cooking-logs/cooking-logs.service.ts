import { Injectable } from '@nestjs/common'
import { CookingLogsRepository } from './cooking-logs.repository'
import { IngredientsRepository } from '../ingredients/ingredients.repository'
import { RecipesRepository } from '../recipes/recipes.repository'
import { CreateCookingLogDto } from './dto/create-cooking-log.dto'

@Injectable()
export class CookingLogsService {
  constructor(
    private readonly cookingLogsRepository: CookingLogsRepository,
    private readonly ingredientsRepository: IngredientsRepository,
    private readonly recipesRepository: RecipesRepository,
  ) {}

  async create(userId: string, dto: CreateCookingLogDto) {
    const log = this.cookingLogsRepository.createLog({
      userId,
      recipeId: dto.recipeId ?? null,
      servingsCooked: dto.servingsCooked,
    })
    const savedLog = await this.cookingLogsRepository.saveLog(log)

    const deducted = []

    for (const used of dto.usedIngredients) {
      const item = this.cookingLogsRepository.createItem({
        cookingLogId: savedLog.id,
        ingredientId: used.ingredientId ?? null,
        ingredientName: used.ingredientName,
        quantityUsed: used.quantityUsed,
        unit: used.unit,
      })

      let deductInfo = null

      if (used.ingredientId) {
        const ingredient = await this.ingredientsRepository.findByIdAndUserId(
          used.ingredientId,
          userId,
        )
        if (ingredient) {
          const prev = Number(ingredient.quantity)
          ingredient.deduct(used.quantityUsed)
          await this.ingredientsRepository.save(ingredient)
          deductInfo = {
            ingredientId: ingredient.id,
            name: ingredient.name,
            previousQuantity: prev,
            usedQuantity: used.quantityUsed,
            remainingQuantity: Number(ingredient.quantity),
            unit: ingredient.unit,
            status: ingredient.status,
          }
        }
      }

      await this.cookingLogsRepository.saveItems([item])
      if (deductInfo) deducted.push(deductInfo)
    }

    const recipe = dto.recipeId ? await this.recipesRepository.findById(dto.recipeId) : null

    return {
      cookingLogId: savedLog.id,
      recipeTitle: recipe?.title ?? null,
      servingsCooked: savedLog.servingsCooked,
      cookedAt: savedLog.cookedAt,
      deductedIngredients: deducted,
    }
  }
}
