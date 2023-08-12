import { CreateBlogPostInput } from './create-blog-post.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateBlogPostInput extends PartialType(CreateBlogPostInput) {
  @Field(() => String)
  @IsUUID('4')
  id: string;
}
