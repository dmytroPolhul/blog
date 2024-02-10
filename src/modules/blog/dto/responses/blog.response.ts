import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BlogOptions } from '../../types/options.object';
import { Blog } from '../../objectTypes/blog.objectType';

@ObjectType()
export class BlogsResponse {
  @Field(() => [Blog])
  results: Blog[];

  @Field(() => BlogOptions)
  options: BlogOptions;

  @Field(() => Int)
  total: number;
}
