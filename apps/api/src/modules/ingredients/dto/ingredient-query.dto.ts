import { IsOptional, IsIn, IsNumber, IsPositive, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'

export class IngredientQueryDto {
  @IsOptional()
  @IsIn(['active', 'consumed', 'expired', 'discarded'])
  status?: 'active' | 'consumed' | 'expired' | 'discarded'

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  expiringWithin?: number

  @IsOptional()
  @IsIn(['expiryDate', 'createdAt', 'name'])
  sort?: string

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc'

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number
}
