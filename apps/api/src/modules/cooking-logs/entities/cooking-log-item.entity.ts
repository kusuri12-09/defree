import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { CookingLog } from './cooking-log.entity'

@Entity('cooking_log_items')
export class CookingLogItem {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => CookingLog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cooking_log_id' })
  cookingLog: CookingLog

  @Column({ name: 'cooking_log_id', type: 'uuid' })
  cookingLogId: string

  @Column({ name: 'ingredient_id', type: 'uuid', nullable: true })
  ingredientId: string | null

  @Column({ name: 'ingredient_name', type: 'varchar', length: 100 })
  ingredientName: string

  @Column({ name: 'quantity_used', type: 'numeric', precision: 8, scale: 2 })
  quantityUsed: number

  @Column({ type: 'varchar', length: 20 })
  unit: string
}
