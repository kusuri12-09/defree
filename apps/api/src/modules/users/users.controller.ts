import { Controller, Get, Patch, Delete, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@CurrentUser() user: CurrentUserPayload) {
    const found = await this.usersService.getProfile(user.id)
    return {
      id: found.id,
      email: found.email,
      name: found.name,
      provider: found.provider,
      createdAt: found.createdAt,
    }
  }

  @Patch('me')
  async updateProfile(@CurrentUser() user: CurrentUserPayload, @Body() dto: UpdateUserDto) {
    const updated = await this.usersService.updateName(user.id, dto.name!)
    return {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      provider: updated.provider,
      createdAt: updated.createdAt,
    }
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  async deleteAccount(@CurrentUser() user: CurrentUserPayload) {
    await this.usersService.deleteAccount(user.id)
    return { message: '계정이 삭제되었습니다.' }
  }
}
