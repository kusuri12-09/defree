import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('ingredient_categories')
export class IngredientCategory {
  @PrimaryGeneratedColumn({ type: 'smallint' })
  id: number

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string

  @Column({ name: 'icon_emoji', type: 'varchar', length: 10 })
  iconEmoji: string

  @Column({ name: 'default_expiry_days', type: 'smallint' })
  defaultExpiryDays: number

  @Column({ name: 'notification_lead_days', type: 'smallint' })
  notificationLeadDays: number

  @Column({ name: 'can_freeze', type: 'boolean', default: false })
  canFreeze: boolean

  @Column({ name: 'frozen_expiry_days', type: 'smallint', nullable: true })
  frozenExpiryDays: number | null

  @Column({ name: 'single_serving_unit', type: 'varchar', length: 20 })
  singleServingUnit: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date
}
