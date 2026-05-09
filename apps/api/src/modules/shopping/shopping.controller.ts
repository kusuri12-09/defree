import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common'
import { ShoppingService } from './shopping.service'
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto'
import { UpdateShoppingItemDto } from './dto/update-shopping-item.dto'
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator'

@Controller('shopping-list')
export class ShoppingController {
  constructor(private readonly service: ShoppingService) {}

  @Get()
  findActiveList(@CurrentUser() user: CurrentUserPayload) {
    return this.service.findActiveList(user.id)
  }

  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  generateList(@CurrentUser() user: CurrentUserPayload) {
    return this.service.generateList(user.id)
  }

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  addItem(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateShoppingItemDto) {
    return this.service.addItem(user.id, dto)
  }

  @Patch('items/:itemId')
  updateItem(
    @CurrentUser() user: CurrentUserPayload,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() dto: UpdateShoppingItemDto,
  ) {
    return this.service.updateItem(itemId, user.id, dto)
  }

  @Delete('items/:itemId')
  @HttpCode(HttpStatus.OK)
  async removeItem(
    @CurrentUser() user: CurrentUserPayload,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ) {
    await this.service.removeItem(itemId, user.id)
    return { message: '항목이 삭제되었습니다.' }
  }

  @Post('complete')
  @HttpCode(HttpStatus.OK)
  completeList(@CurrentUser() user: CurrentUserPayload) {
    return this.service.completeList(user.id)
  }
}
