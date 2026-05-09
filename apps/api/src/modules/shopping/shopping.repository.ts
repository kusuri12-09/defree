import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ShoppingList } from './entities/shopping-list.entity'
import { ShoppingListItem } from './entities/shopping-list-item.entity'

@Injectable()
export class ShoppingRepository {
  constructor(
    @InjectRepository(ShoppingList)
    private readonly listRepo: Repository<ShoppingList>,
    @InjectRepository(ShoppingListItem)
    private readonly itemRepo: Repository<ShoppingListItem>,
  ) {}

  findActiveList(userId: string) {
    return this.listRepo.findOne({ where: { userId, isActive: true } })
  }

  findListWithItems(userId: string) {
    return this.listRepo.findOne({
      where: { userId, isActive: true },
      relations: ['items'],
      order: { items: { createdAt: 'ASC' } },
    })
  }

  createList(data: Partial<ShoppingList>) {
    return this.listRepo.create(data)
  }
  saveList(list: ShoppingList) {
    return this.listRepo.save(list)
  }

  findItemById(id: string) {
    return this.itemRepo.findOne({ where: { id } })
  }
  createItem(data: Partial<ShoppingListItem>) {
    return this.itemRepo.create(data)
  }
  saveItem(item: ShoppingListItem) {
    return this.itemRepo.save(item)
  }
  deleteItem(id: string) {
    return this.itemRepo.delete(id)
  }
}
