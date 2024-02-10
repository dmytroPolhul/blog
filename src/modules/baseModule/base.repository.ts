import { InferSelectModel, Table } from 'drizzle-orm/table';
import { db } from '../../config/pg.config';

export abstract class BaseRepository<T extends Table> {
  protected constructor(protected readonly model: T) {}

  async findAll(): Promise<InferSelectModel<T>[]> {
    return db.select().from(this.model) as any as InferSelectModel<T>[];
  }
}
