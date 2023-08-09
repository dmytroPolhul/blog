import { TypeOrmModule } from '@nestjs/typeorm';
import {Blog} from './entities/blog.entity';
import { Module } from '@nestjs/common';
import {BlogRepository} from "./repositories/blog.repository";
import {BlogService} from "./blog.service";
import {BlogResolver} from "./blog.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([Blog])],
  providers: [BlogRepository, BlogService, BlogResolver],
  exports: [BlogService],
})
export class BlogModule {}
