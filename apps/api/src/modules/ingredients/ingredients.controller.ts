import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common'
import { IngredientsService } from './ingredients.service'
import { CreateIngredientDto } from './dto/create-ingredient.dto'
import { UpdateIngredientDto } from './dto/update-ingredient.dto'
import { FreezeIngredientDto } from './dto/freeze-ingredient.dto'
import { IngredientQueryDto } from './dto/ingredient-query.dto'
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator'

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly service: IngredientsService) {}

  @Get()
  async findAll(@CurrentUser() user: CurrentUserPayload, @Query() query: IngredientQueryDto) {
    const { items, total, page, limit } = await this.service.findAll(user.id, query)
    return { data: items, meta: { total, page, limit } }
  }

  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateIngredientDto) {
    return this.service.create(user.id, dto)
  }

  @Get(':id')
  findOne(@CurrentUser() user: CurrentUserPayload, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id, user.id)
  }

  @Patch(':id')
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateIngredientDto,
  ) {
    return this.service.update(id, user.id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentUser() user: CurrentUserPayload, @Param('id', ParseUUIDPipe) id: string) {
    await this.service.remove(id, user.id)
    return { message: '재고가 삭제되었습니다.' }
  }

  @Patch(':id/freeze')
  freeze(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: FreezeIngredientDto,
  ) {
    return this.service.freeze(id, user.id, dto)
  }
}
