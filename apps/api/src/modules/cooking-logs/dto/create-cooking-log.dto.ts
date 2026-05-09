import {
  IsArray,
  IsNumber,
  IsString,
  IsUUID,
  IsOptional,
  Length,
  Min,
  ValidateNested,
  ArrayMinSize,
  IsPositive,
} from 'class-validator'
import { Type } from 'class-transformer'

export class UsedIngredientDto {
  @IsUUID()
  @IsOptional()
  ingredientId: string | null

  @IsString()
  @Length(1, 100)
  ingredientName: string

  @IsNumber()
  @Min(0.01)
  quantityUsed: number

  @IsString()
  @Length(1, 20)
  unit: string
}

export class CreateCookingLogDto {
  @IsUUID()
  @IsOptional()
  recipeId?: string | null

  @IsNumber()
  @IsPositive()
  servingsCooked: number

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UsedIngredientDto)
  usedIngredients: UsedIngredientDto[]
}
