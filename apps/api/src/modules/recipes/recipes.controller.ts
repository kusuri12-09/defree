import { Controller, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common'
import { RecipesService } from './recipes.service'
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator'

@Controller('recipes')
export class RecipesController {
  constructor(private readonly service: RecipesService) {}

  @Get('recommendations')
  getRecommendations(
    @CurrentUser() user: CurrentUserPayload,
    @Query('includePartial') includePartial?: boolean,
    @Query('maxMissingIngredients') maxMissingIngredients?: number,
    @Query('cookTimeMax') cookTimeMax?: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.getRecommendations(user.id, {
      includePartial,
      maxMissingIngredients,
      cookTimeMax,
      limit,
    })
  }

  @Get(':id')
  getDetail(@CurrentUser() user: CurrentUserPayload, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.getDetail(id, user.id)
  }
}
