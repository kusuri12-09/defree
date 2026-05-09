import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IngredientCategory } from './entities/ingredient-category.entity'

@Injectable()
export class IngredientCategoriesRepository {
  constructor(
    @InjectRepository(IngredientCategory)
    private readonly repo: Repository<IngredientCategory>,
  ) {}

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } })
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } })
  }
}
