export interface OAuthLoginDto {
  code: string
  redirectUri: string
}

export interface AuthUserDto {
  id: string
  email: string
  name: string
  provider: 'google' | 'kakao'
}

export interface AuthTokenResponseDto {
  accessToken: string
  user: AuthUserDto
}

export interface RefreshTokenResponseDto {
  accessToken: string
}
