import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogResolver } from './blog.resolver';
import { UserModule } from '../user/user.module';
import { BlogRepository } from './repositories/blog.repository';

@Module({
  imports: [UserModule],
  providers: [BlogRepository, BlogService, BlogResolver],
  exports: [BlogService],
})
export class BlogModule {}
