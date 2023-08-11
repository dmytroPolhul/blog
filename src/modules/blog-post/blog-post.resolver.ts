import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent, Context,
} from '@nestjs/graphql';
import { BlogPostService } from './blog-post.service';
import { BlogPost } from './entities/blog-post.entity';
import { CreateBlogPostInput } from './dto/create-blog-post.input';
import { UpdateBlogPostInput } from './dto/update-blog-post.input';
import { Blog } from '../blog/entities/blog.entity';
import { BlogPostsResponse } from './dto/responses/blogPost.response';
import { BlogPostFilteringPaginationSorting } from './types/filteringPaginationSorting.input';
import {AuthPermission} from "../../common/decorators/auth.decorator";
import {Role} from "../../common/enums/userRole.enum";

@Resolver(() => BlogPost)
export class BlogPostResolver {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Mutation(() => BlogPost)
  @AuthPermission(Role.WRITER)
  createBlogPost(
    @Args('createBlogPostInput') createBlogPostInput: CreateBlogPostInput,
  ) {
    return this.blogPostService.createPost(createBlogPostInput);
  }

  @Mutation(() => BlogPost)
  @AuthPermission()
  updateBlogPost(
    @Args('updateBlogPostInput') updateBlogPostInput: UpdateBlogPostInput,
    @Context() context,
  ): Promise<BlogPost> {
    const user = context.req.user;
    return this.blogPostService.updatePost(user, updateBlogPostInput);
  }

  @Mutation(() => BlogPost)
  @AuthPermission()
  removeBlogPost(
      @Args('id', { type: () => String }) id: string,
      @Context() context,
  ) {
    const user = context.req.user;
    return this.blogPostService.deletePost(user, id);
  }

  @Query(() => BlogPostsResponse, { name: 'blogPosts' })
  blogPosts(
    @Args('filter', { nullable: true })
    filter?: BlogPostFilteringPaginationSorting,
  ): Promise<BlogPostsResponse> {
    return this.blogPostService.getPosts(filter);
  }

  @Query(() => BlogPost, { name: 'blogPost' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.blogPostService.getPost(id);
  }

  @ResolveField((returns) => Blog)
  blog(@Parent() blogPost: BlogPost): Promise<Blog> {
    return this.blogPostService.getMainBlog(blogPost.blog.id);
  }
}
