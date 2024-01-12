import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export abstract class BaseRepository<_T> {
  protected tableName: string;
  protected constructor(
    @Inject('DATABASE_POOL') protected readonly pool: Pool,
    tableName: string,
  ) {
    this.tableName = tableName;
  }
}
