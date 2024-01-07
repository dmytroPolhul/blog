import { Module, Global } from '@nestjs/common';
import { db } from '../config/pg.config';

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      useValue: db,
    },
  ],
  exports: ['DATABASE_POOL'],
})
export class DatabaseModule {}
