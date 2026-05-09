import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ShoppingList } from './entities/shopping-list.entity'
import { ShoppingListItem } from './entities/shopping-list-item.entity'
import { ShoppingRepository } from './shopping.repository'
import { ShoppingService } from './shopping.service'
import { ShoppingController } from './shopping.controller'
import { IngredientsModule } from '../ingredients/ingredients.module'

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingList, ShoppingListItem]), IngredientsModule],
  controllers: [ShoppingController],
  providers: [ShoppingRepository, ShoppingService],
})
export class ShoppingModule {}
