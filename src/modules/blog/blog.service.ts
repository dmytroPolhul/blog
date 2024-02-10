import { Injectable } from '@nestjs/common';
import { UpdateBlogInput } from './dto/requests/update-blog.input';
import { CreateBlogInput } from './dto/requests/create-blog.input';
import { BlogsResponse } from './dto/responses/blog.response';
import { FilteringPaginationSorting } from './types/filteringPaginationSorting.input';
import { Role } from '../../common/enums/userRole.enum';
import { ForbiddenError } from '@nestjs/apollo';
import { UserService } from '../user/user.service';
import { BlogRepository } from './repositories/blog.repository';
import { BaseService } from '../baseModule/base.service';
import { BlogTable } from './entities/blog.schema';
import { Blog } from './objectTypes/blog.objectType';
import { User } from '../user/objectTypes/user.objectType';

@Injectable()
export class BlogService extends BaseService<typeof BlogTable> {
  constructor(
    private userService: UserService,
    private blogRepository: BlogRepository,
  ) {
    super(blogRepository);
  }

  async createBlog(request: CreateBlogInput): Promise<Blog> {
    const author = await this.userService.getUser(request.authorId);
    if (author.role === Role.MODERATOR) {
      throw new ForbiddenError('You are not performing this action');
    }
    return this.blogRepository.save({ ...request, authorId: author.id });
  }

  async updateBlog(user: User, request: UpdateBlogInput): Promise<Blog> {
    const blog = await this.blogRepository.findOneByIdWithRelationsOrFail(
      request.id,
      ['author'],
    );

    if (user.role !== Role.MODERATOR && blog.author.id !== user.id) {
      throw new ForbiddenError('You can only update your own blogs.');
    }

    delete request.id;
    return this.blogRepository.updateEntity({
      ...blog,
      ...request,
    });
  }

  async deleteBlog(user: User, id: string): Promise<boolean> {
    const blog = await this.blogRepository.findOneByIdWithRelationsOrFail(id, [
      'author',
    ]);

    if (user.role !== Role.MODERATOR && blog.author.id !== user.id) {
      throw new ForbiddenError('You can only delete your own blogs.');
    }

    const affectedBlog = await this.blogRepository.hardDelete(id);
    return !!affectedBlog;
  }

  async getBlog(id: string): Promise<Blog> {
    return this.blogRepository.findOneByIdWithRelationsOrFail(id, [
      'author',
      //'posts',
    ]);
  }

  async getBlogs(request?: FilteringPaginationSorting): Promise<BlogsResponse> {
    //TODO: Can be optimized
    const posts = request?.filter?.includePosts
      ? { relations: ['posts'] }
      : undefined;
    const whereOptions = {
      where: {
        id: request?.filter?.blogId,
        author: request?.filter?.authorId
          ? {
              id: request?.filter?.authorId,
            }
          : undefined,
      },
      skip: request?.pagination?.offset,
      take: request?.pagination?.limit,
      order: {
        [request?.sorting?.field]: request?.sorting?.order,
      },
    };

    const [results, total] = await this.blogRepository.findMany({
      ...whereOptions,
      ...posts,
      relations: ['author'],
    });
    return {
      results,
      options: {
        pagination: request?.pagination,
        sorting: request?.sorting,
        filter: request?.filter,
      },
      total,
    };
  }

  async getAuthor(id: string): Promise<User> {
    return this.userService.getUser(id);
  }

  // async findRelatedPosts(id: string): Promise<Blog[]> {
  //   return this.blogRepository.find({ where: { id }, relations: ['posts'] });
  // }
}
