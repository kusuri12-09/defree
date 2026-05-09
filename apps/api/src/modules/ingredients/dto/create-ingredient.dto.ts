import { IsString, IsNumber, IsPositive, IsDateString, Length, Min } from 'class-validator'

export class CreateIngredientDto {
  @IsString()
  @Length(1, 100)
  name: string

  @IsNumber()
  @IsPositive()
  categoryId: number

  @IsNumber()
  @Min(0.01)
  quantity: number

  @IsString()
  @Length(1, 20)
  unit: string

  @IsDateString()
  purchaseDate: string

  @IsDateString()
  expiryDate: string
}
