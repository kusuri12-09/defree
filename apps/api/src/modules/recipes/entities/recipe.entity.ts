import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

export type RecipeSource = 'mangae' | 'youtube' | 'gpt'

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'external_id', type: 'varchar', length: 100, unique: true })
  externalId: string

  @Column({ type: 'varchar', length: 30 })
  source: RecipeSource

  @Column({ type: 'varchar', length: 200 })
  title: string

  @Column({ type: 'smallint', default: 1 })
  servings: number

  @Column({ name: 'cook_time_minutes', type: 'smallint', nullable: true })
  cookTimeMinutes: number | null

  @Column({ name: 'thumbnail_url', type: 'varchar', length: 500, nullable: true })
  thumbnailUrl: string | null

  @Column({ name: 'source_url', type: 'varchar', length: 500, nullable: true })
  sourceUrl: string | null

  @Column({ name: 'youtube_url', type: 'varchar', length: 500, nullable: true })
  youtubeUrl: string | null

  @Column({ type: 'text', nullable: true })
  description: string | null

  @CreateDateColumn({ name: 'cached_at', type: 'timestamptz' })
  cachedAt: Date

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date

  isExpired(): boolean {
    return this.expiresAt < new Date()
  }
}
