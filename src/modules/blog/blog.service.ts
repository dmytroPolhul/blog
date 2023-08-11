import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseService } from '../baseModule/base.service';
import { Blog } from './entities/blog.entity';
import { BlogRepository } from './repositories/blog.repository';
import { UpdateBlogInput } from './dto/requests/update-blog.input';
import { CreateBlogInput } from './dto/requests/create-blog.input';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { BlogsResponse } from './dto/responses/blog.response';
import { FilteringPaginationSorting } from './types/filteringPaginationSorting.input';
import { Role } from '../../common/enums/userRole.enum';

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
    return this.blogRepository.create({ ...request, author });
  }

  async updateBlog(user: User, request: UpdateBlogInput): Promise<Blog> {
    const blog = await this.blogRepository.findOne({
      where: { id: request.id },
      relations: ['author'],
    });

    if (user.role !== Role.MODERATOR && blog.author.id !== user.id) {
      throw new UnauthorizedException('You can only update your own blogs.');
    }

    delete request.id;
    const updatedBlog = await this.blogRepository.update({
      ...blog,
      ...request,
    });
    return this.getBlog(blog.id);
  }

  async deleteBlog(user: User, id: string): Promise<boolean> {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (user.role !== Role.MODERATOR && blog.author.id !== user.id) {
      throw new UnauthorizedException('You can only delete your own blogs.');
    }

    const affectedBlog = await this.blogRepository.hardDelete({ id });
    return !!affectedBlog;
  }

  async getBlog(id: string): Promise<Blog> {
    return this.blogRepository.findOneOrFail({
      where: { id },
      relations: ['author', 'posts'],
    });
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
        [request.sorting.field]: request.sorting.order,
      },
    };

    const [results, total] = await this.blogRepository.findAndCount({
      ...whereOptions,
      ...posts,
    });
    return {
      results,
      options: {
        pagination: request?.pagination,
        sorting: request?.sorting,
        filter: request.filter,
      },
      total,
    };
  }

  async getAuthor(id: string): Promise<User> {
    return this.userService.getUser(id);
  }

  async findRelatedPosts(id: string): Promise<Blog[]> {
    return this.blogRepository.find({ where: { id }, relations: ['posts'] });
  }

  async checkOwnership(blogId: string, userId: string): Promise<boolean> {
    const blog = await this.getBlog(blogId);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog.author.id === userId;
  }
}