import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BlogPostOptions } from '../../types/blogPost-options.object';
import { BlogPost } from '../../objectTypes/blog-post.objectTypes';

@ObjectType()
export class BlogPostsResponse {
  @Field(() => [BlogPost])
  results: BlogPost[];

  @Field(() => BlogPostOptions)
  options: BlogPostOptions;

  @Field(() => Int)
  total: number;
}
