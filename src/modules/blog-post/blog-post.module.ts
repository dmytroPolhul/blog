import { Module } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { BlogPostResolver } from './blog-post.resolver';
import { BlogModule } from '../blog/blog.module';
import { UserModule } from '../user/user.module';
import { BlogPostRepository } from './repositories/blog-post.repository';

@Module({
  imports: [BlogModule, UserModule],
  providers: [BlogPostRepository, BlogPostService, BlogPostResolver],
  exports: [BlogPostService],
})
export class BlogPostModule {}
