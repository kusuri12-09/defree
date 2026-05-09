export type NotificationChannel = 'web_push' | 'discord' | 'slack'

export interface NotificationSettingsDto {
  id: string
  webPushEnabled: boolean
  webPushToken: string | null
  discordEnabled: boolean
  discordWebhookUrlMasked: string | null
  slackEnabled: boolean
  slackWebhookUrlMasked: string | null
  notifyTime: string
  leadDaysOverride: number | null
  updatedAt: string
}

export interface UpdateNotificationSettingsDto {
  webPushEnabled?: boolean
  discordEnabled?: boolean
  discordWebhookUrl?: string | null
  slackEnabled?: boolean
  slackWebhookUrl?: string | null
  notifyTime?: string
  leadDaysOverride?: number | null
}

export interface SubscribePushDto {
  token: string
  channel: 'fcm'
}

export interface SubscribePushResponseDto {
  message: string
  webPushEnabled: boolean
}
