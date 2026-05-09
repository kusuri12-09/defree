import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { IngredientCategory } from '../../ingredient-categories/entities/ingredient-category.entity'

export type IngredientStatus = 'active' | 'consumed' | 'expired' | 'discarded'
export type IngredientSource = 'ocr' | 'manual' | 'digital'

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string

  @ManyToOne(() => IngredientCategory)
  @JoinColumn({ name: 'category_id' })
  category: IngredientCategory

  @Column({ name: 'category_id', type: 'smallint' })
  categoryId: number

  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({ type: 'numeric', precision: 8, scale: 2 })
  quantity: number

  @Column({ type: 'varchar', length: 20 })
  unit: string

  @Column({ name: 'purchase_date', type: 'date' })
  purchaseDate: string

  @Column({ name: 'expiry_date', type: 'date' })
  expiryDate: string

  @Column({ name: 'is_frozen', type: 'boolean', default: false })
  isFrozen: boolean

  @Column({ name: 'frozen_at', type: 'date', nullable: true })
  frozenAt: string | null

  @Column({
    type: 'varchar',
    length: 20,
    default: 'active',
  })
  status: IngredientStatus

  @Column({
    type: 'varchar',
    length: 20,
    default: 'manual',
  })
  source: IngredientSource

  @Column({ name: 'receipt_item_id', type: 'uuid', nullable: true })
  receiptItemId: string | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date

  calculateDDay(): number {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expiry = new Date(this.expiryDate)
    expiry.setHours(0, 0, 0, 0)
    return Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  markAsConsumed(): void {
    this.status = 'consumed'
    this.quantity = 0
  }

  markAsFrozen(frozenExpiryDays: number): void {
    const today = new Date()
    this.isFrozen = true
    this.frozenAt = today.toISOString().split('T')[0]
    const newExpiry = new Date(today)
    newExpiry.setDate(newExpiry.getDate() + frozenExpiryDays)
    this.expiryDate = newExpiry.toISOString().split('T')[0]
  }

  deduct(amount: number): void {
    this.quantity = Math.max(0, Number(this.quantity) - amount)
    if (this.quantity === 0) {
      this.status = 'consumed'
    }
  }
}
