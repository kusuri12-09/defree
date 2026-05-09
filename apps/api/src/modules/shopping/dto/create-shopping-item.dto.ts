import { IsString, Length, IsNumber, Min } from 'class-validator'

export class CreateShoppingItemDto {
  @IsString()
  @Length(1, 100)
  ingredientName: string

  @IsNumber()
  @Min(0.01)
  quantity: number

  @IsString()
  @Length(1, 20)
  unit: string
}
