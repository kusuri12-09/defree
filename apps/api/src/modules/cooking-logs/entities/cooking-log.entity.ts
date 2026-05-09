import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'

@Entity('cooking_logs')
export class CookingLog {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string

  @Column({ name: 'recipe_id', type: 'uuid', nullable: true })
  recipeId: string | null

  @Column({ name: 'servings_cooked', type: 'smallint', default: 1 })
  servingsCooked: number

  @CreateDateColumn({ name: 'cooked_at', type: 'timestamptz' })
  cookedAt: Date
}
