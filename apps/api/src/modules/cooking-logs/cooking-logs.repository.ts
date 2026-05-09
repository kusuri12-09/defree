import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CookingLog } from './entities/cooking-log.entity'
import { CookingLogItem } from './entities/cooking-log-item.entity'

@Injectable()
export class CookingLogsRepository {
  constructor(
    @InjectRepository(CookingLog)
    private readonly logRepo: Repository<CookingLog>,
    @InjectRepository(CookingLogItem)
    private readonly itemRepo: Repository<CookingLogItem>,
  ) {}

  createLog(data: Partial<CookingLog>) {
    return this.logRepo.create(data)
  }
  saveLog(log: CookingLog) {
    return this.logRepo.save(log)
  }
  createItem(data: Partial<CookingLogItem>) {
    return this.itemRepo.create(data)
  }
  saveItems(items: CookingLogItem[]) {
    return this.itemRepo.save(items)
  }
}
