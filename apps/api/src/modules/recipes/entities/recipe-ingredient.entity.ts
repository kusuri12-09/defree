import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { Recipe } from './recipe.entity'

@Entity('recipe_ingredients')
export class RecipeIngredient {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Recipe, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe

  @Column({ name: 'recipe_id', type: 'uuid' })
  recipeId: string

  @Column({ name: 'ingredient_name', type: 'varchar', length: 100 })
  ingredientName: string

  @Column({ type: 'numeric', precision: 8, scale: 2 })
  quantity: number

  @Column({ type: 'varchar', length: 20 })
  unit: string

  @Column({ name: 'is_optional', type: 'boolean', default: false })
  isOptional: boolean

  @Column({ name: 'is_seasoning', type: 'boolean', default: false })
  isSeasoning: boolean
}
