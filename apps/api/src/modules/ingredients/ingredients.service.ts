import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { IngredientsRepository } from './ingredients.repository'
import { IngredientCategoriesService } from '../ingredient-categories/ingredient-categories.service'
import { CreateIngredientDto } from './dto/create-ingredient.dto'
import { UpdateIngredientDto } from './dto/update-ingredient.dto'
import { FreezeIngredientDto } from './dto/freeze-ingredient.dto'
import { IngredientQueryDto } from './dto/ingredient-query.dto'
import { Ingredient } from './entities/ingredient.entity'

@Injectable()
export class IngredientsService {
  constructor(
    private readonly ingredientsRepository: IngredientsRepository,
    private readonly categoriesService: IngredientCategoriesService,
  ) {}

  async findAll(userId: string, query: IngredientQueryDto) {
    const { items, total } = await this.ingredientsRepository.findAll({ userId, ...query })
    return {
      items: items.map((i) => this.toDto(i)),
      total,
      page: query.page ?? 1,
      limit: query.limit ?? 50,
    }
  }

  async findOne(id: string, userId: string) {
    const ingredient = await this.ingredientsRepository.findByIdAndUserId(id, userId)
    if (!ingredient) throw new NotFoundException('NOT_FOUND')
    return this.toDto(ingredient)
  }

  async create(userId: string, dto: CreateIngredientDto) {
    await this.categoriesService.findById(dto.categoryId)
    const ingredient = this.ingredientsRepository.create({
      userId,
      ...dto,
      source: 'manual',
      status: 'active',
    })
    const saved = await this.ingredientsRepository.save(ingredient)
    return this.findOne(saved.id, userId)
  }

  async update(id: string, userId: string, dto: UpdateIngredientDto) {
    const ingredient = await this.getOrThrow(id, userId)
    if (dto.categoryId) await this.categoriesService.findById(dto.categoryId)
    Object.assign(ingredient, dto)
    await this.ingredientsRepository.save(ingredient)
    return this.findOne(id, userId)
  }

  async remove(id: string, userId: string) {
    const ingredient = await this.getOrThrow(id, userId)
    ingredient.status = 'discarded'
    await this.ingredientsRepository.save(ingredient)
  }

  async freeze(id: string, userId: string, dto: FreezeIngredientDto) {
    const ingredient = await this.getOrThrow(id, userId)
    const category = await this.categoriesService.findById(ingredient.categoryId)

    if (dto.isFrozen) {
      if (!category.canFreeze) {
        throw new UnprocessableEntityException({
          code: 'CATEGORY_NOT_FREEZABLE',
          message: '냉동 보관이 불가능한 카테고리입니다.',
        })
      }
      ingredient.markAsFrozen(category.frozenExpiryDays!)
    } else {
      ingredient.isFrozen = false
      ingredient.frozenAt = null
    }

    await this.ingredientsRepository.save(ingredient)
    return this.findOne(id, userId)
  }

  private async getOrThrow(id: string, userId: string): Promise<Ingredient> {
    const ingredient = await this.ingredientsRepository.findByIdAndUserId(id, userId)
    if (!ingredient) throw new NotFoundException('NOT_FOUND')
    return ingredient
  }

  private toDto(ingredient: Ingredient) {
    return {
      id: ingredient.id,
      name: ingredient.name,
      category: ingredient.category
        ? {
            id: ingredient.category.id,
            name: ingredient.category.name,
            iconEmoji: ingredient.category.iconEmoji,
          }
        : null,
      quantity: Number(ingredient.quantity),
      unit: ingredient.unit,
      purchaseDate: ingredient.purchaseDate,
      expiryDate: ingredient.expiryDate,
      dDay: ingredient.calculateDDay(),
      isFrozen: ingredient.isFrozen,
      frozenAt: ingredient.frozenAt,
      status: ingredient.status,
      source: ingredient.source,
      createdAt: ingredient.createdAt,
      updatedAt: ingredient.updatedAt,
    }
  }
}
