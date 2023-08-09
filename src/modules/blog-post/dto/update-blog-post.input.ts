import { CreateBlogPostInput } from './create-blog-post.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBlogPostInput extends PartialType(CreateBlogPostInput) {
  @Field(() => Int)
  id: number;
}
