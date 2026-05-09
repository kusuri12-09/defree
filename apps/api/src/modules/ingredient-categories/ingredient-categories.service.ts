import { Injectable, NotFoundException } from '@nestjs/common'
import { IngredientCategoriesRepository } from './ingredient-categories.repository'

@Injectable()
export class IngredientCategoriesService {
  constructor(private readonly repo: IngredientCategoriesRepository) {}

  findAll() {
    return this.repo.findAll()
  }

  async findById(id: number) {
    const category = await this.repo.findById(id)
    if (!category) throw new NotFoundException('NOT_FOUND')
    return category
  }
}
