import { Controller, Get, Put, Post, Delete, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto'
import { SubscribePushDto } from './dto/subscribe-push.dto'
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator'

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get('settings')
  getSettings(@CurrentUser() user: CurrentUserPayload) {
    return this.service.getSettings(user.id)
  }

  @Put('settings')
  updateSettings(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UpdateNotificationSettingsDto,
  ) {
    return this.service.updateSettings(user.id, dto)
  }

  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  subscribe(@CurrentUser() user: CurrentUserPayload, @Body() dto: SubscribePushDto) {
    return this.service.subscribePush(user.id, dto)
  }

  @Delete('subscribe')
  @HttpCode(HttpStatus.OK)
  unsubscribe(@CurrentUser() user: CurrentUserPayload) {
    return this.service.unsubscribePush(user.id)
  }
}
