import { IsBoolean } from 'class-validator'

export class FreezeIngredientDto {
  @IsBoolean()
  isFrozen: boolean
}
