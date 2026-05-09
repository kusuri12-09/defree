import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Receipt } from './entities/receipt.entity'
import { ReceiptItem } from './entities/receipt-item.entity'
import { ReceiptsRepository } from './receipts.repository'
import { ReceiptsService } from './receipts.service'
import { ReceiptsController } from './receipts.controller'
import { IngredientsModule } from '../ingredients/ingredients.module'
import { IngredientCategoriesModule } from '../ingredient-categories/ingredient-categories.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Receipt, ReceiptItem]),
    IngredientsModule,
    IngredientCategoriesModule,
  ],
  controllers: [ReceiptsController],
  providers: [ReceiptsRepository, ReceiptsService],
})
export class ReceiptsModule {}
