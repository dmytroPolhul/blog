import { Injectable } from '@nestjs/common';
import { BaseService } from '../baseModule/base.service';
import { BlogPost } from './entities/blog-post.entity';
import { BlogPostRepository } from './repositories/blogPost.repository';
import {CreateBlogPostInput} from "./dto/create-blog-post.input";
import {BlogService} from "../blog/blog.service";
import {UpdateBlogPostInput} from "./dto/update-blog-post.input";
import {Blog} from "../blog/entities/blog.entity";
import {BlogPostFilteringPaginationSorting} from "./types/filteringPaginationSorting.input";
import {BlogPostsResponse} from "./dto/responses/blogPost.response";
import {ILike} from "typeorm";

@Injectable()
export class BlogPostService extends BaseService<BlogPost> {
  constructor(
      private blogService: BlogService,
      private blogPostRepository: BlogPostRepository,
  ) {
    super(blogPostRepository);
  }

  async createPost(request: CreateBlogPostInput): Promise<BlogPost> {
    const blog = await this.blogService.getBlog(request.blogId)
    return this.blogPostRepository.create({...request, blog})
  }

  async updatePost(request: UpdateBlogPostInput): Promise<BlogPost> {
    const post = await this.blogPostRepository.findOne({where: {id: request.id}});

    let blog = post.blog;
    if(request.blogId) {
      blog = await this.blogService.getBlog(request.blogId);
    }
    return this.blogPostRepository.update({...post, blog})
  }

  async getPost(id: string): Promise<BlogPost> {
    return this.blogPostRepository.findOneOrFail({where: {id}});
  }

  async getPosts(request?: BlogPostFilteringPaginationSorting): Promise<BlogPostsResponse> {
    const whereOptions = {
      where: {
        id: request?.filter?.blogPostId,
        title: request?.filter?.title ? ILike(`%${request?.filter?.title}%`) : undefined
      },
      skip: request?.pagination?.offset,
      take: request?.pagination?.limit,
      order: {
        [request?.sorting?.field]: request?.sorting?.order,
      },
    }
    const [results, total] = await this.blogPostRepository.findAndCount({...whereOptions});

    return {
      results,
      options: {pagination: request?.pagination, sorting: request?.sorting, filter: request?.filter},
      total,
    }
  }

  async deletePost(id: string): Promise<boolean> {
    const post = await this.blogPostRepository.hardDelete({id});
    return !!post;
  }

  async getMainBlog(id: string): Promise<Blog> {
    return this.blogService.getBlog(id);
  }
}
