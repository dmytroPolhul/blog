import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Module } from '@nestjs/common';
import { BlogRepository } from './repositories/blog.repository';
import { BlogService } from './blog.service';
import { BlogResolver } from './blog.resolver';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Blog]), UserModule],
  providers: [BlogRepository, BlogService, BlogResolver],
  exports: [BlogService],
})
export class BlogModule {}
