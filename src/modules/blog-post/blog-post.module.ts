import { Module } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { BlogPostResolver } from './blog-post.resolver';
import {BlogPostRepository} from "./repositories/blogPost.repository";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BlogPost} from "./entities/blog-post.entity";

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost])],
  providers: [BlogPostRepository, BlogPostResolver, BlogPostService]
})
export class BlogPostModule {}
