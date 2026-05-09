export interface UserDto {
  id: string
  email: string
  name: string
  provider: 'google' | 'kakao'
  createdAt: string
}

export interface UpdateUserDto {
  name?: string
}
