import { Injectable, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron, CronExpression } from '@nestjs/schedule'
import { NotificationsRepository } from './notifications.repository'
import { IngredientsRepository } from '../ingredients/ingredients.repository'
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto'
import { SubscribePushDto } from './dto/subscribe-push.dto'
import * as crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly ingredientsRepository: IngredientsRepository,
    private readonly configService: ConfigService,
  ) {}

  async getSettings(userId: string) {
    let settings = await this.notificationsRepository.findSettingsByUserId(userId)
    if (!settings) {
      settings = this.notificationsRepository.createSettings({ userId })
      settings = await this.notificationsRepository.saveSettings(settings)
    }
    return this.toDto(settings)
  }

  async updateSettings(userId: string, dto: UpdateNotificationSettingsDto) {
    let settings = await this.notificationsRepository.findSettingsByUserId(userId)
    if (!settings) {
      settings = this.notificationsRepository.createSettings({ userId })
    }

    if (dto.discordEnabled && !dto.discordWebhookUrl && !settings.discordWebhookUrlEnc) {
      throw new BadRequestException({
        code: 'DISCORD_ENABLED_WITHOUT_URL',
        message: 'Discord 활성화 시 Webhook URL이 필요합니다.',
      })
    }
    if (dto.slackEnabled && !dto.slackWebhookUrl && !settings.slackWebhookUrlEnc) {
      throw new BadRequestException({
        code: 'SLACK_ENABLED_WITHOUT_URL',
        message: 'Slack 활성화 시 Webhook URL이 필요합니다.',
      })
    }

    if (dto.discordWebhookUrl !== undefined) {
      settings.discordWebhookUrlEnc = dto.discordWebhookUrl
        ? this.encrypt(dto.discordWebhookUrl)
        : null
    }
    if (dto.slackWebhookUrl !== undefined) {
      settings.slackWebhookUrlEnc = dto.slackWebhookUrl ? this.encrypt(dto.slackWebhookUrl) : null
    }

    if (dto.webPushEnabled !== undefined) settings.webPushEnabled = dto.webPushEnabled
    if (dto.discordEnabled !== undefined) settings.discordEnabled = dto.discordEnabled
    if (dto.slackEnabled !== undefined) settings.slackEnabled = dto.slackEnabled
    if (dto.notifyTime !== undefined) settings.notifyTime = dto.notifyTime
    if (dto.leadDaysOverride !== undefined) settings.leadDaysOverride = dto.leadDaysOverride ?? null

    const saved = await this.notificationsRepository.saveSettings(settings)
    return this.toDto(saved)
  }

  async subscribePush(userId: string, dto: SubscribePushDto) {
    let settings = await this.notificationsRepository.findSettingsByUserId(userId)
    if (!settings) {
      settings = this.notificationsRepository.createSettings({ userId })
    }
    settings.webPushToken = dto.token
    settings.webPushEnabled = true
    await this.notificationsRepository.saveSettings(settings)
    return { message: 'Web Push 알림이 활성화되었습니다.', webPushEnabled: true }
  }

  async unsubscribePush(userId: string) {
    const settings = await this.notificationsRepository.findSettingsByUserId(userId)
    if (settings) {
      settings.webPushToken = null
      settings.webPushEnabled = false
      await this.notificationsRepository.saveSettings(settings)
    }
    return { message: 'Web Push 알림이 해제되었습니다.', webPushEnabled: false }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async runDailyNotificationScheduler() {
    // TODO: 유통기한 임박 재료 조회 → 채널별 알림 발송
    // 1. 오늘 날짜 + notification_lead_days 기준으로 임박 재료 조회
    // 2. 사용자별 알림 설정 조회
    // 3. Discord/Slack Webhook, FCM Web Push 발송
    // 4. notification_logs 저장
  }

  private toDto(settings: any) {
    return {
      id: settings.id,
      webPushEnabled: settings.webPushEnabled,
      webPushToken: settings.webPushToken,
      discordEnabled: settings.discordEnabled,
      discordWebhookUrlMasked: settings.discordWebhookUrlEnc
        ? this.maskWebhookUrl(this.decrypt(settings.discordWebhookUrlEnc))
        : null,
      slackEnabled: settings.slackEnabled,
      slackWebhookUrlMasked: settings.slackWebhookUrlEnc
        ? this.maskWebhookUrl(this.decrypt(settings.slackWebhookUrlEnc))
        : null,
      notifyTime: settings.notifyTime,
      leadDaysOverride: settings.leadDaysOverride,
      updatedAt: settings.updatedAt,
    }
  }

  private encrypt(text: string): string {
    const key = Buffer.from(this.configService.get<string>('WEBHOOK_ENCRYPTION_KEY') as string)
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
    const tag = cipher.getAuthTag()
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`
  }

  private decrypt(data: string): string {
    const [ivHex, tagHex, encryptedHex] = data.split(':')
    const key = Buffer.from(this.configService.get<string>('WEBHOOK_ENCRYPTION_KEY') as string)
    const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, 'hex'))
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'))
    return (
      decipher.update(Buffer.from(encryptedHex, 'hex')).toString('utf8') + decipher.final('utf8')
    )
  }

  private maskWebhookUrl(url: string): string {
    try {
      const parsed = new URL(url)
      return `${parsed.protocol}//${parsed.host}/****`
    } catch {
      return '****'
    }
  }
}
