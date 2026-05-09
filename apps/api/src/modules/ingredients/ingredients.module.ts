import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Ingredient } from './entities/ingredient.entity'
import { IngredientsRepository } from './ingredients.repository'
import { IngredientsService } from './ingredients.service'
import { IngredientsController } from './ingredients.controller'
import { IngredientCategoriesModule } from '../ingredient-categories/ingredient-categories.module'

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient]), IngredientCategoriesModule],
  controllers: [IngredientsController],
  providers: [IngredientsRepository, IngredientsService],
  exports: [IngredientsService, IngredientsRepository],
})
export class IngredientsModule {}
