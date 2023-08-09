import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BlogPostService } from './blog-post.service';
import { BlogPost } from './entities/blog-post.entity';
import { CreateBlogPostInput } from './dto/create-blog-post.input';
import { UpdateBlogPostInput } from './dto/update-blog-post.input';

@Resolver(() => BlogPost)
export class BlogPostResolver {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Mutation(() => BlogPost)
  createBlogPost(
    @Args('createBlogPostInput') createBlogPostInput: CreateBlogPostInput,
  ) {
    return this.blogPostService.create(createBlogPostInput as any);
  }

  @Query(() => [BlogPost], { name: 'blogPost' })
  findAll() {
    return this.blogPostService.find(undefined);
  }

  @Query(() => BlogPost, { name: 'blogPost' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.blogPostService.findOne({ where: { id } });
  }

  @Mutation(() => BlogPost)
  updateBlogPost(
    @Args('updateBlogPostInput') updateBlogPostInput: UpdateBlogPostInput,
  ) {
    return this.blogPostService.update(updateBlogPostInput as any);
  }

  @Mutation(() => BlogPost)
  removeBlogPost(@Args('id', { type: () => String }) id: string) {
    return this.blogPostService.delete({ id });
  }
}
