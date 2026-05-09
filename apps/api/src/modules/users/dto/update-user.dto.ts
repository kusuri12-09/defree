import { IsString, IsOptional, Length } from 'class-validator'

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Length(1, 100)
  name?: string
}
