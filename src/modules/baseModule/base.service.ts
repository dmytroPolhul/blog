import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { Table } from 'drizzle-orm';
import { InferSelectModel } from 'drizzle-orm/table';

@Injectable()
export class BaseService<TypeofEntity extends Table<any>> {
  constructor(protected readonly repository: BaseRepository<TypeofEntity>) {}

  async findAll(): Promise<InferSelectModel<TypeofEntity>[] | undefined> {
    return this.repository.findAll();
  }
}
