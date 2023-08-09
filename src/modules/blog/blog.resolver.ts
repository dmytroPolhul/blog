import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlogService } from './blog.service';
import { Blog } from './entities/blog.entity';
import { BlogRequest } from './dto/requests/blog.request';

@Resolver((of) => Blog)
export class BlogResolver {
  constructor(private blogService: BlogService) {}

  @Query((returns) => [Blog])
  blog(): Promise<Blog[]> {
    return this.blogService.find(undefined);
  }

  @Mutation((returns) => Blog)
  createBlog(@Args('createBlogInput') request: BlogRequest): Promise<Blog> {
    return this.blogService.create(request);
  }

  @Query((returns) => Blog)
  getBlogById(
    @Args('blogId', { type: () => String }) blogId: string,
  ): Promise<Blog> {
    return this.blogService.findOneOrFail({ where: { id: blogId } });
  }
}
