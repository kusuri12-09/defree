import { Injectable, NotFoundException } from '@nestjs/common'
import { UsersRepository } from './users.repository'
import { User } from './entities/user.entity'

interface CreateUserData {
  email: string
  name: string
  provider: 'google' | 'kakao'
  providerId: string
}

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findById(id: string) {
    return this.usersRepository.findById(id)
  }

  findByProvider(provider: 'google' | 'kakao', providerId: string) {
    return this.usersRepository.findByProvider(provider, providerId)
  }

  async create(data: CreateUserData): Promise<User> {
    const user = this.usersRepository.create(data)
    return this.usersRepository.save(user)
  }

  async updateRefreshToken(id: string, hash: string | null): Promise<void> {
    const user = await this.usersRepository.findById(id)
    if (!user) throw new NotFoundException('NOT_FOUND')
    user.updateRefreshToken(hash)
    await this.usersRepository.save(user)
  }

  async clearRefreshToken(id: string): Promise<void> {
    await this.updateRefreshToken(id, null)
  }

  async getProfile(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id)
    if (!user) throw new NotFoundException('NOT_FOUND')
    return user
  }

  async updateName(id: string, name: string): Promise<User> {
    const user = await this.getProfile(id)
    user.name = name
    return this.usersRepository.save(user)
  }

  async deleteAccount(id: string): Promise<void> {
    const user = await this.getProfile(id)
    user.softDelete()
    await this.usersRepository.save(user)
  }
}
