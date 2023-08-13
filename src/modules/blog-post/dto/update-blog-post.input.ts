import { CreateBlogPostInput } from './create-blog-post.input';
import { InputType, Field, PartialType, OmitType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateBlogPostInput extends PartialType(
  OmitType(CreateBlogPostInput, ['blogId']),
) {
  @Field(() => String)
  @IsUUID('4')
  id: string;
}
