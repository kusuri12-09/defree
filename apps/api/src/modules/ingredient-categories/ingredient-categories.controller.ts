import { Controller, Get } from '@nestjs/common'
import { IngredientCategoriesService } from './ingredient-categories.service'
import { Public } from '../../common/decorators/public.decorator'

@Public()
@Controller('ingredient-categories')
export class IngredientCategoriesController {
  constructor(private readonly service: IngredientCategoriesService) {}

  @Get()
  findAll() {
    return this.service.findAll()
  }
}
