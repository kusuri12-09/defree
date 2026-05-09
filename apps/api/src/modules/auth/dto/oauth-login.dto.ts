import { IsString, IsUrl } from 'class-validator'

export class OAuthLoginDto {
  @IsString()
  code: string

  @IsUrl()
  redirectUri: string
}
