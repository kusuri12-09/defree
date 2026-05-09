import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CookingLog } from './entities/cooking-log.entity'
import { CookingLogItem } from './entities/cooking-log-item.entity'
import { CookingLogsRepository } from './cooking-logs.repository'
import { CookingLogsService } from './cooking-logs.service'
import { CookingLogsController } from './cooking-logs.controller'
import { IngredientsModule } from '../ingredients/ingredients.module'
import { RecipesModule } from '../recipes/recipes.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([CookingLog, CookingLogItem]),
    IngredientsModule,
    RecipesModule,
  ],
  controllers: [CookingLogsController],
  providers: [CookingLogsRepository, CookingLogsService],
})
export class CookingLogsModule {}
