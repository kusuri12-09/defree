import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IngredientCategory } from './entities/ingredient-category.entity'
import { IngredientCategoriesRepository } from './ingredient-categories.repository'
import { IngredientCategoriesService } from './ingredient-categories.service'
import { IngredientCategoriesController } from './ingredient-categories.controller'

@Module({
  imports: [TypeOrmModule.forFeature([IngredientCategory])],
  controllers: [IngredientCategoriesController],
  providers: [IngredientCategoriesRepository, IngredientCategoriesService],
  exports: [IngredientCategoriesService],
})
export class IngredientCategoriesModule {}
