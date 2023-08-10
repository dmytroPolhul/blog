import { Injectable } from '@nestjs/common';
import { BaseService } from '../baseModule/base.service';
import { Blog } from './entities/blog.entity';
import { BlogRepository } from './repositories/blog.repository';
import {UpdateBlogInput} from "./dto/requests/update-blog.input";
import {CreateBlogInput} from "./dto/requests/create-blog.input";
import {UserService} from "../user/user.service";
import {User} from "../user/entities/user.entity";
import {BlogsResponse} from "./dto/responses/blog.response";
import {FilteringPaginationSorting} from "./types/filteringPaginationSorting.input";

@Injectable()
export class BlogService extends BaseService<Blog> {
  constructor(
      private userService: UserService,
      private blogRepository: BlogRepository,
  ) {
    super(blogRepository);
  }

  async createBlog(request: CreateBlogInput): Promise<Blog> {
    const author = await this.userService.getUser(request.authorId);
    return this.blogRepository.create({...request, author});
  }

  async updateBlog(request: UpdateBlogInput): Promise<Blog> {
    const blog = await this.blogRepository.findOne({where: {id: request.id}});
    let author = blog.author;
    if (request.authorId){
      author = await this.userService.getUser(request.authorId);
    }
    return this.blogRepository.update({...blog, ...request, author});
  }

  async deleteBlog(id: string): Promise<boolean> {
    const blog = await this.blogRepository.hardDelete({id});
    return !!blog;
  }

  async getBlog(id: string): Promise<Blog> {
    return this.blogRepository.findOneOrFail({where: {id}, relations: ['author', 'posts']});
  }

  async getBlogs(request?: FilteringPaginationSorting):Promise<BlogsResponse> {

    //TODO: Can be optimized
    const posts = request?.filter?.includePosts ? {relations: ['posts']} : undefined
    const whereOptions = {
      where: {
        id: request?.filter?.blogId,
        author: request?.filter?.authorId ? {
          id: request?.filter?.authorId
        } : undefined
      },
      skip: request?.pagination?.offset,
      take: request?.pagination?.limit,
      order: {
        [request.sorting.field]: request.sorting.order,
      },
    }

    const [results, total] = await this.blogRepository.findAndCount({...whereOptions, ...posts});
    return {
      results,
      options: {pagination: request?.pagination, sorting: request?.sorting, filter: request.filter},
      total,
    }
  }

  async getAuthor(id: string): Promise<User> {
    return this.userService.getUser(id);
  }

  async findRelatedPosts(id: string): Promise<Blog[]> {
    return this.blogRepository.find({where: {id}, relations: ['posts']});
  }
}
