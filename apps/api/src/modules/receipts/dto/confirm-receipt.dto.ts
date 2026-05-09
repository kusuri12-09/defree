import {
  IsArray,
  IsDateString,
  IsNumber,
  IsString,
  IsUUID,
  Length,
  Min,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator'
import { Type } from 'class-transformer'

export class ConfirmReceiptItemDto {
  @IsUUID()
  receiptItemId: string

  @IsString()
  @Length(1, 100)
  normalizedName: string

  @IsNumber()
  @IsNumber()
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

export class ConfirmReceiptDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ConfirmReceiptItemDto)
  items: ConfirmReceiptItemDto[]
}
