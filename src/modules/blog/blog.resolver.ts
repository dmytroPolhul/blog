import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { BlogService } from './blog.service';
import { Blog } from './entities/blog.entity';
import { CreateBlogInput } from './dto/requests/create-blog.input';
import { UpdateBlogInput } from './dto/requests/update-blog.input';
import { User } from '../user/entities/user.entity';
import { BlogsResponse } from './dto/responses/blog.response';
import { FilteringPaginationSorting } from './types/filteringPaginationSorting.input';
import { AuthPermission } from '../../common/decorators/auth.decorator';
import { Role } from '../../common/enums/userRole.enum';

@Resolver((of) => Blog)
export class BlogResolver {
  constructor(private blogService: BlogService) {}

  @Mutation((returns) => Blog)
  @AuthPermission(Role.WRITER)
  createBlog(@Args('createBlogInput') request: CreateBlogInput): Promise<Blog> {
    return this.blogService.createBlog(request);
  }

  @Mutation((returns) => Blog)
  updateBlog(@Args('updateBlogInput') request: UpdateBlogInput): Promise<Blog> {
    return this.blogService.updateBlog(request);
  }

  @Mutation((returns) => Blog)
  deleteBlog(@Args('blogId') blogId: string): Promise<boolean> {
    return this.blogService.deleteBlog(blogId);
  }

  @Query((returns) => Blog)
  getBlogById(
    @Args('blogId', { type: () => String }) blogId: string,
  ): Promise<Blog> {
    return this.blogService.getBlog(blogId);
  }

  @Query((returns) => BlogsResponse)
  blogs(
    @Args('filter', { nullable: true }) filter?: FilteringPaginationSorting,
  ): Promise<BlogsResponse> {
    return this.blogService.getBlogs(filter);
  }

  @Query((returns) => [Blog])
  async getBlogPosts(
    @Args('blogId', { type: () => String }) blogId: string,
  ): Promise<Blog[]> {
    return this.blogService.findRelatedPosts(blogId);
  }

  @ResolveField((returns) => User)
  author(@Parent() blog: Blog): Promise<User> {
    return this.blogService.getAuthor(blog.author.id);
  }
}
