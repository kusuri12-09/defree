import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import { Receipt } from './receipt.entity'

@Entity('receipt_items')
export class ReceiptItem {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Receipt, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receipt_id' })
  receipt: Receipt

  @Column({ name: 'receipt_id', type: 'uuid' })
  receiptId: string

  @Column({ name: 'raw_name', type: 'varchar', length: 200 })
  rawName: string

  @Column({ name: 'normalized_name', type: 'varchar', length: 100, nullable: true })
  normalizedName: string | null

  @Column({ type: 'numeric', precision: 8, scale: 2, default: 1 })
  quantity: number

  @Column({ type: 'varchar', length: 20, default: '개' })
  unit: string

  @Column({ name: 'is_confirmed', type: 'boolean', default: false })
  isConfirmed: boolean

  @Column({ name: 'ingredient_id', type: 'uuid', nullable: true })
  ingredientId: string | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date
}
