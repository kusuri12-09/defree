import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'

export type ReceiptStatus = 'pending' | 'processing' | 'completed' | 'failed'

@Entity('receipts')
export class Receipt {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string

  @Column({ name: 'image_url', type: 'varchar', length: 500 })
  imageUrl: string

  @Column({ name: 'ocr_raw_text', type: 'text', nullable: true })
  ocrRawText: string | null

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: ReceiptStatus

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null

  @CreateDateColumn({ name: 'scanned_at', type: 'timestamptz' })
  scannedAt: Date

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date | null

  markAsProcessing(): void {
    this.status = 'processing'
  }

  markAsCompleted(): void {
    this.status = 'completed'
    this.completedAt = new Date()
  }

  markAsFailed(error: string): void {
    this.status = 'failed'
    this.errorMessage = error
  }
}
