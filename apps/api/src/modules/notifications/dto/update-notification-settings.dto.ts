import { IsBoolean, IsOptional, IsString, Matches, IsNumber, Min } from 'class-validator'

export class UpdateNotificationSettingsDto {
  @IsBoolean()
  @IsOptional()
  webPushEnabled?: boolean

  @IsBoolean()
  @IsOptional()
  discordEnabled?: boolean

  @IsString()
  @IsOptional()
  discordWebhookUrl?: string | null

  @IsBoolean()
  @IsOptional()
  slackEnabled?: boolean

  @IsString()
  @IsOptional()
  slackWebhookUrl?: string | null

  @IsString()
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'notifyTime은 HH:MM 형식이어야 합니다.' })
  notifyTime?: string

  @IsNumber()
  @IsOptional()
  @Min(1)
  leadDaysOverride?: number | null
}
