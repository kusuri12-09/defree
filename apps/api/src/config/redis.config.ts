import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

export const REDIS_CLIENT = 'REDIS_CLIENT'

export const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): Redis => {
    const client = new Redis(configService.get<string>('REDIS_URL') as string, {
      lazyConnect: true,
      maxRetriesPerRequest: 3,
    })

    client.on('error', (err) => {
      console.error('[Redis] Connection error:', err.message)
    })

    return client
  },
}
