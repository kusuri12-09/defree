import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core'
import { ThrottlerModule } from '@nestjs/throttler'
import { ScheduleModule } from '@nestjs/schedule'

import { validationSchema } from './config/validation.schema'
import { databaseConfig } from './config/database.config'
import { redisProvider } from './config/redis.config'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { JwtAuthGuard } from './common/guards/jwt-auth.guard'

import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { IngredientCategoriesModule } from './modules/ingredient-categories/ingredient-categories.module'
import { IngredientsModule } from './modules/ingredients/ingredients.module'
import { ReceiptsModule } from './modules/receipts/receipts.module'
import { RecipesModule } from './modules/recipes/recipes.module'
import { CookingLogsModule } from './modules/cooking-logs/cooking-logs.module'
import { ShoppingModule } from './modules/shopping/shopping.module'
import { NotificationsModule } from './modules/notifications/notifications.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    IngredientCategoriesModule,
    IngredientsModule,
    ReceiptsModule,
    RecipesModule,
    CookingLogsModule,
    ShoppingModule,
    NotificationsModule,
  ],
  providers: [
    redisProvider,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
