import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import { ShoppingList } from './shopping-list.entity'

export type CommercePlatform = 'coupang' | 'kurly' | 'bmart'
export type ShoppingItemSource = 'auto' | 'manual'

@Entity('shopping_list_items')
export class ShoppingListItem {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => ShoppingList, (list) => list.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shopping_list_id' })
  shoppingList: ShoppingList

  @Column({ name: 'shopping_list_id', type: 'uuid' })
  shoppingListId: string

  @Column({ name: 'ingredient_name', type: 'varchar', length: 100 })
  ingredientName: string

  @Column({ type: 'numeric', precision: 8, scale: 2 })
  quantity: number

  @Column({ type: 'varchar', length: 20 })
  unit: string

  @Column({ name: 'is_small_package', type: 'boolean', default: true })
  isSmallPackage: boolean

  @Column({ name: 'commerce_url', type: 'varchar', length: 500, nullable: true })
  commerceUrl: string | null

  @Column({ name: 'commerce_platform', type: 'varchar', length: 30, nullable: true })
  commercePlatform: CommercePlatform | null

  @Column({ type: 'varchar', length: 20, default: 'auto' })
  source: ShoppingItemSource

  @Column({ name: 'is_purchased', type: 'boolean', default: false })
  isPurchased: boolean

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date
}
