import { IsString, IsIn } from 'class-validator'

export class SubscribePushDto {
  @IsString()
  token: string

  @IsIn(['fcm'])
  channel: 'fcm'
}
