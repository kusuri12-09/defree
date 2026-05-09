import { IsBoolean, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator'

export class UpdateShoppingItemDto {
  @IsBoolean()
  @IsOptional()
  isPurchased?: boolean

  @IsNumber()
  @IsOptional()
  @Min(0.01)
  quantity?: number

  @IsString()
  @IsOptional()
  @Length(1, 20)
  unit?: string
}
