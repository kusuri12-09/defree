import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
} from 'typeorm'

@Entity('users')
@Unique('uq_users_provider', ['provider', 'providerId'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 320, unique: true })
  email: string

  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({ type: 'varchar', length: 20 })
  provider: 'google' | 'kakao'

  @Column({ name: 'provider_id', type: 'varchar', length: 255 })
  providerId: string

  @Column({ name: 'refresh_token_hash', type: 'varchar', length: 255, nullable: true })
  refreshTokenHash: string | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null

  updateRefreshToken(hash: string | null): void {
    this.refreshTokenHash = hash
  }

  softDelete(): void {
    this.deletedAt = new Date()
  }
}
