import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { NotificationSettings } from './entities/notification-settings.entity'
import { NotificationLog } from './entities/notification-log.entity'

@Injectable()
export class NotificationsRepository {
  constructor(
    @InjectRepository(NotificationSettings)
    private readonly settingsRepo: Repository<NotificationSettings>,
    @InjectRepository(NotificationLog)
    private readonly logRepo: Repository<NotificationLog>,
  ) {}

  findSettingsByUserId(userId: string) {
    return this.settingsRepo.findOne({ where: { userId } })
  }

  createSettings(data: Partial<NotificationSettings>) {
    return this.settingsRepo.create(data)
  }
  saveSettings(settings: NotificationSettings) {
    return this.settingsRepo.save(settings)
  }

  saveLog(log: Partial<NotificationLog>) {
    return this.logRepo.save(this.logRepo.create(log))
  }

  findActiveChannelUsers(notifyTime: string) {
    return this.settingsRepo
      .createQueryBuilder('ns')
      .where('ns.notify_time = :notifyTime', { notifyTime })
      .andWhere(
        '(ns.web_push_enabled = true OR ns.discord_enabled = true OR ns.slack_enabled = true)',
      )
      .getMany()
  }
}
