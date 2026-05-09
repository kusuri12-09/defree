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

@Entity('notification_settings')
export class NotificationSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string

  @Column({ name: 'web_push_enabled', type: 'boolean', default: false })
  webPushEnabled: boolean

  @Column({ name: 'web_push_token', type: 'varchar', length: 500, nullable: true })
  webPushToken: string | null

  @Column({ name: 'discord_enabled', type: 'boolean', default: false })
  discordEnabled: boolean

  @Column({ name: 'discord_webhook_url_enc', type: 'text', nullable: true })
  discordWebhookUrlEnc: string | null

  @Column({ name: 'slack_enabled', type: 'boolean', default: false })
  slackEnabled: boolean

  @Column({ name: 'slack_webhook_url_enc', type: 'text', nullable: true })
  slackWebhookUrlEnc: string | null

  @Column({ name: 'notify_time', type: 'time', default: '09:00:00' })
  notifyTime: string

  @Column({ name: 'lead_days_override', type: 'smallint', nullable: true })
  leadDaysOverride: number | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date
}
