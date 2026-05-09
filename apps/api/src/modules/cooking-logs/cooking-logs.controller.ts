import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { CookingLogsService } from './cooking-logs.service'
import { CreateCookingLogDto } from './dto/create-cooking-log.dto'
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator'

@Controller('cooking-logs')
export class CookingLogsController {
  constructor(private readonly service: CookingLogsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateCookingLogDto) {
    return this.service.create(user.id, dto)
  }
}
