import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'

export type NotificationChannel = 'web_push' | 'discord' | 'slack'
export type NotificationLogStatus = 'sent' | 'failed' | 'retrying'

@Entity('notification_logs')
export class NotificationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string

  @Column({ name: 'ingredient_id', type: 'uuid', nullable: true })
  ingredientId: string | null

  @Column({ type: 'varchar', length: 20 })
  channel: NotificationChannel

  @Column({ type: 'text' })
  message: string

  @Column({ type: 'varchar', length: 20, default: 'sent' })
  status: NotificationLogStatus

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null

  @CreateDateColumn({ name: 'sent_at', type: 'timestamptz' })
  sentAt: Date

  @Column({ name: 'retry_count', type: 'smallint', default: 0 })
  retryCount: number
}
