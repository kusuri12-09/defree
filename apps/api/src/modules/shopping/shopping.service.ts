import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { ShoppingRepository } from './shopping.repository'
import { IngredientsRepository } from '../ingredients/ingredients.repository'
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto'
import { UpdateShoppingItemDto } from './dto/update-shopping-item.dto'

@Injectable()
export class ShoppingService {
  constructor(
    private readonly shoppingRepository: ShoppingRepository,
    private readonly ingredientsRepository: IngredientsRepository,
  ) {}

  async findActiveList(userId: string) {
    return this.shoppingRepository.findListWithItems(userId)
  }

  async generateList(userId: string) {
    let list = await this.shoppingRepository.findActiveList(userId)
    if (!list) {
      list = this.shoppingRepository.createList({ userId })
      list = await this.shoppingRepository.saveList(list)
    }

    // TODO: 재고 분석 알고리즘으로 구매 목록 자동 생성
    const savedList = await this.shoppingRepository.findListWithItems(userId)
    return savedList
  }

  async addItem(userId: string, dto: CreateShoppingItemDto) {
    let list = await this.shoppingRepository.findActiveList(userId)
    if (!list) {
      list = this.shoppingRepository.createList({ userId })
      list = await this.shoppingRepository.saveList(list)
    }

    const item = this.shoppingRepository.createItem({
      shoppingListId: list.id,
      ingredientName: dto.ingredientName,
      quantity: dto.quantity,
      unit: dto.unit,
      source: 'manual',
    })
    return this.shoppingRepository.saveItem(item)
  }

  async updateItem(itemId: string, userId: string, dto: UpdateShoppingItemDto) {
    const item = await this.getItemOrThrow(itemId, userId)
    Object.assign(item, dto)
    return this.shoppingRepository.saveItem(item)
  }

  async removeItem(itemId: string, userId: string) {
    await this.getItemOrThrow(itemId, userId)
    await this.shoppingRepository.deleteItem(itemId)
  }

  async completeList(userId: string) {
    const list = await this.shoppingRepository.findListWithItems(userId)
    if (!list) throw new NotFoundException('NOT_FOUND')
    const purchasedCount = list.items?.filter((i) => i.isPurchased).length ?? 0
    list.complete()
    await this.shoppingRepository.saveList(list)
    return {
      completedAt: list.completedAt,
      purchasedCount,
      message: '장보기 완료! 영수증을 스캔하면 재고가 자동 등록돼요.',
    }
  }

  private async getItemOrThrow(itemId: string, userId: string) {
    const item = await this.shoppingRepository.findItemById(itemId)
    if (!item) throw new NotFoundException('NOT_FOUND')
    const list = await this.shoppingRepository.findActiveList(userId)
    if (!list || item.shoppingListId !== list.id) throw new ForbiddenException('FORBIDDEN')
    return item
  }
}
