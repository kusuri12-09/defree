import { IsString, IsNumber, IsOptional, IsDateString, Length, Min, IsIn } from 'class-validator'

export class UpdateIngredientDto {
  @IsString()
  @IsOptional()
  @Length(1, 100)
  name?: string

  @IsNumber()
  @IsOptional()
  categoryId?: number

  @IsNumber()
  @IsOptional()
  @Min(0)
  quantity?: number

  @IsString()
  @IsOptional()
  @Length(1, 20)
  unit?: string

  @IsDateString()
  @IsOptional()
  purchaseDate?: string

  @IsDateString()
  @IsOptional()
  expiryDate?: string

  @IsString()
  @IsOptional()
  @IsIn(['consumed', 'discarded'])
  status?: 'consumed' | 'discarded'
}
