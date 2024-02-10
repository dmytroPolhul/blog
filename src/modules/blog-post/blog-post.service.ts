import { Injectable } from '@nestjs/common';
import { CreateBlogPostInput } from './dto/create-blog-post.input';
import { BlogService } from '../blog/blog.service';
import { UpdateBlogPostInput } from './dto/update-blog-post.input';
import { BlogPostFilteringPaginationSorting } from './types/filteringPaginationSorting.input';
import { BlogPostsResponse } from './dto/responses/blogPost.response';
import { Role } from '../../common/enums/userRole.enum';
import { ForbiddenError } from '@nestjs/apollo';
import { Blog } from '../blog/objectTypes/blog.objectType';
import { BlogPostRepository } from './repositories/blog-post.repository';
import { BaseService } from '../baseModule/base.service';
import { BlogPostTable } from './entities/blog-post.schema';
import { BlogPost } from './objectTypes/blog-post.objectTypes';
import { User } from '../user/objectTypes/user.objectType';

@Injectable()
export class BlogPostService extends BaseService<typeof BlogPostTable> {
  constructor(
    private blogService: BlogService,
    private blogPostRepository: BlogPostRepository,
  ) {
    super(blogPostRepository);
  }

  async createPost(request: CreateBlogPostInput): Promise<BlogPost> {
    return this.blogPostRepository.save({ ...request });
  }

  async updatePost(
    user: User,
    request: UpdateBlogPostInput,
  ): Promise<BlogPost> {
    const post = await this.blogPostRepository.findOneByIdWithRelationsOrFail(
      request.id,
      ['blog'],
    );

    if (user.role !== Role.MODERATOR && post.blog.author.id !== user.id) {
      throw new ForbiddenError('You can only update your own blog posts.');
    }

    return this.blogPostRepository.updateEntity({ ...post, ...request });
  }

  async getPost(id: string): Promise<BlogPost> {
    return this.blogPostRepository.findOneByIdWithRelationsOrFail(id, ['blog']);
  }

  async getPosts(
    request?: BlogPostFilteringPaginationSorting,
  ): Promise<BlogPostsResponse> {
    const whereOptions = {
      where: {
        id: request?.filter?.blogPostId,
        isPublish: request?.filter?.isPublish
          ? request?.filter?.isPublish
          : undefined,
        tags: undefined,
        title: request?.filter?.title,
        // title: request?.filter?.title
        //   ? ILike(`%${request?.filter?.title}%`)
        //   : undefined,
      },
      skip: request?.pagination?.offset,
      take: request?.pagination?.limit,
      order: {
        [request?.sorting?.field]: request?.sorting?.order,
      },
    };

    if (request?.filter?.tag) {
      //whereOptions.where.tags = Any([request?.filter?.tag]);
    }

    const [results, total] = await this.blogPostRepository.findMany({
      ...whereOptions,
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

  async deletePost(user: User, id: string): Promise<boolean> {
    const post = await this.getPost(id);
    if (user.role !== Role.MODERATOR && post.blog.author.id !== user.id) {
      throw new ForbiddenError('You can only delete your own blog posts.');
    }
    const affectedPost = await this.blogPostRepository.hardDelete(id);
    return !!affectedPost;
  }

  async getMainBlog(id: string): Promise<Blog> {
    return this.blogService.getBlog(id);
  }
}
