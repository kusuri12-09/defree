import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, LessThanOrEqual } from 'typeorm'
import { Ingredient, IngredientStatus } from './entities/ingredient.entity'

interface FindAllOptions {
  userId: string
  status?: IngredientStatus
  categoryId?: number
  expiringWithin?: number
  sort?: string
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

@Injectable()
export class IngredientsRepository {
  constructor(
    @InjectRepository(Ingredient)
    private readonly repo: Repository<Ingredient>,
  ) {}

  async findAll(options: FindAllOptions) {
    const {
      userId,
      status = 'active',
      categoryId,
      expiringWithin,
      sort = 'expiryDate',
      order = 'asc',
      page = 1,
      limit = 50,
    } = options

    const qb = this.repo
      .createQueryBuilder('i')
      .leftJoinAndSelect('i.category', 'category')
      .where('i.user_id = :userId', { userId })
      .andWhere('i.status = :status', { status })

    if (categoryId) qb.andWhere('i.category_id = :categoryId', { categoryId })

    if (expiringWithin !== undefined) {
      const targetDate = new Date()
      targetDate.setDate(targetDate.getDate() + expiringWithin)
      qb.andWhere('i.expiry_date <= :targetDate', {
        targetDate: targetDate.toISOString().split('T')[0],
      })
    }

    const sortMap: Record<string, string> = {
      expiryDate: 'i.expiry_date',
      createdAt: 'i.created_at',
      name: 'i.name',
    }
    qb.orderBy(sortMap[sort] ?? 'i.expiry_date', order.toUpperCase() as 'ASC' | 'DESC')

    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()
    return { items, total }
  }

  findByIdAndUserId(id: string, userId: string) {
    return this.repo.findOne({ where: { id, userId, status: 'active' }, relations: ['category'] })
  }

  findAllActive(userId: string) {
    return this.repo.find({ where: { userId, status: 'active' }, relations: ['category'] })
  }

  findExpiringIngredients(beforeDate: string) {
    return this.repo.find({
      where: { status: 'active', expiryDate: LessThanOrEqual(beforeDate) },
      relations: ['user'],
    })
  }

  save(ingredient: Ingredient) {
    return this.repo.save(ingredient)
  }

  saveMany(ingredients: Ingredient[]) {
    return this.repo.save(ingredients)
  }

  create(data: Partial<Ingredient>) {
    return this.repo.create(data)
  }
}
