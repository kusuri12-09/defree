import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  findById(id: string) {
    return this.repo.findOne({ where: { id, deletedAt: undefined } })
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email, deletedAt: undefined } })
  }

  findByProvider(provider: 'google' | 'kakao', providerId: string) {
    return this.repo.findOne({ where: { provider, providerId, deletedAt: undefined } })
  }

  save(user: User) {
    return this.repo.save(user)
  }

  create(data: Partial<User>) {
    return this.repo.create(data)
  }
}
