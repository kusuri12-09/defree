import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { Recipe } from './entities/recipe.entity'
import { RecipeIngredient } from './entities/recipe-ingredient.entity'

@Injectable()
export class RecipesRepository {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepo: Repository<Recipe>,
    @InjectRepository(RecipeIngredient)
    private readonly ingredientRepo: Repository<RecipeIngredient>,
  ) {}

  findById(id: string) {
    return this.recipeRepo.findOne({ where: { id } })
  }

  findByIngredientNames(names: string[]) {
    return this.ingredientRepo.find({ where: { ingredientName: In(names) }, relations: ['recipe'] })
  }

  findIngredientsByRecipeId(recipeId: string) {
    return this.ingredientRepo.find({ where: { recipeId } })
  }

  findIngredientsByRecipeIds(recipeIds: string[]) {
    return this.ingredientRepo.find({ where: { recipeId: In(recipeIds) } })
  }
}
