import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Receipt } from './entities/receipt.entity'
import { ReceiptItem } from './entities/receipt-item.entity'

@Injectable()
export class ReceiptsRepository {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepo: Repository<Receipt>,
    @InjectRepository(ReceiptItem)
    private readonly itemRepo: Repository<ReceiptItem>,
  ) {}

  createReceipt(data: Partial<Receipt>) {
    return this.receiptRepo.create(data)
  }
  saveReceipt(receipt: Receipt) {
    return this.receiptRepo.save(receipt)
  }

  findReceiptById(id: string) {
    return this.receiptRepo.findOne({ where: { id } })
  }

  findReceiptByIdAndUserId(id: string, userId: string) {
    return this.receiptRepo.findOne({ where: { id, userId } })
  }

  findAllByUserId(userId: string, page = 1, limit = 20) {
    return this.receiptRepo.findAndCount({
      where: { userId },
      order: { scannedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })
  }

  findItemsByReceiptId(receiptId: string) {
    return this.itemRepo.find({ where: { receiptId } })
  }

  findItemByIdAndReceiptId(id: string, receiptId: string) {
    return this.itemRepo.findOne({ where: { id, receiptId } })
  }

  deleteItemsByReceiptId(receiptId: string) {
    return this.itemRepo.delete({ receiptId })
  }

  saveItems(items: ReceiptItem[]) {
    return this.itemRepo.save(items)
  }
  createItem(data: Partial<ReceiptItem>) {
    return this.itemRepo.create(data)
  }
  saveItem(item: ReceiptItem) {
    return this.itemRepo.save(item)
  }
}
