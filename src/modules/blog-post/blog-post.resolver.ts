import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { BlogPostService } from './blog-post.service';
import { BlogPost } from './entities/blog-post.entity';
import { CreateBlogPostInput } from './dto/create-blog-post.input';
import { UpdateBlogPostInput } from './dto/update-blog-post.input';
import { Blog } from '../blog/entities/blog.entity';
import { BlogPostsResponse } from './dto/responses/blogPost.response';
import { FilteringPaginationSorting } from '../blog/types/filteringPaginationSorting.input';
import { BlogPostFilteringPaginationSorting } from './types/filteringPaginationSorting.input';

@Resolver(() => BlogPost)
export class BlogPostResolver {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Mutation(() => BlogPost)
  createBlogPost(
    @Args('createBlogPostInput') createBlogPostInput: CreateBlogPostInput,
  ) {
    return this.blogPostService.createPost(createBlogPostInput);
  }

  @Mutation(() => BlogPost)
  updateBlogPost(
    @Args('updateBlogPostInput') updateBlogPostInput: UpdateBlogPostInput,
  ) {
    return this.blogPostService.updatePost(updateBlogPostInput);
  }

  @Mutation(() => BlogPost)
  removeBlogPost(@Args('id', { type: () => String }) id: string) {
    return this.blogPostService.deletePost(id);
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
