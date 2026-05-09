import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NotificationSettings } from './entities/notification-settings.entity'
import { NotificationLog } from './entities/notification-log.entity'
import { NotificationsRepository } from './notifications.repository'
import { NotificationsService } from './notifications.service'
import { NotificationsController } from './notifications.controller'
import { IngredientsModule } from '../ingredients/ingredients.module'

@Module({
  imports: [TypeOrmModule.forFeature([NotificationSettings, NotificationLog]), IngredientsModule],
  controllers: [NotificationsController],
  providers: [NotificationsRepository, NotificationsService],
})
export class NotificationsModule {}
