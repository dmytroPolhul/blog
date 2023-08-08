import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity])],
  providers: [],
  exports: [],
  controllers: [],
})
export class BlogModule {}
