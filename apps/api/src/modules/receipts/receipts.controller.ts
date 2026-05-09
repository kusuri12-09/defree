import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Throttle } from '@nestjs/throttler'
import { ReceiptsService } from './receipts.service'
import { ConfirmReceiptDto } from './dto/confirm-receipt.dto'
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator'

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly service: ReceiptsService) {}

  @Post('scan')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
          return cb(
            new BadRequestException({
              code: 'IMAGE_TYPE_INVALID',
              message: '허용되지 않는 파일 형식입니다.',
            }),
            false,
          )
        }
        cb(null, true)
      },
    }),
  )
  @HttpCode(HttpStatus.ACCEPTED)
  async scan(@CurrentUser() user: CurrentUserPayload, @UploadedFile() file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException({
        code: 'IMAGE_REQUIRED',
        message: '이미지 파일이 필요합니다.',
      })
    const receipt = await this.service.scanReceipt(user.id, file)
    return { receiptId: receipt.id, status: receipt.status, scannedAt: receipt.scannedAt }
  }

  @Get(':receiptId')
  async getResult(
    @CurrentUser() user: CurrentUserPayload,
    @Param('receiptId', ParseUUIDPipe) receiptId: string,
  ) {
    const { receipt, items } = await this.service.getResultWithItems(receiptId, user.id)
    return {
      receiptId: receipt.id,
      status: receipt.status,
      completedAt: receipt.completedAt,
      errorMessage: receipt.errorMessage,
      items,
    }
  }

  @Post(':receiptId/confirm')
  @HttpCode(HttpStatus.CREATED)
  confirm(
    @CurrentUser() user: CurrentUserPayload,
    @Param('receiptId', ParseUUIDPipe) receiptId: string,
    @Body() dto: ConfirmReceiptDto,
  ) {
    return this.service.confirmAndSave(receiptId, user.id, dto)
  }

  @Get()
  async findAll(
    @CurrentUser() user: CurrentUserPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const {
      receipts,
      total,
      page: p,
      limit: l,
    } = await this.service.findAllByUser(user.id, page, limit)
    return { data: receipts, meta: { total, page: p, limit: l } }
  }
}
