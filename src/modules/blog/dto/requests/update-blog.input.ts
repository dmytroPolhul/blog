import {InputType, Field, PartialType, OmitType} from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateBlogInput } from './create-blog.input';

@InputType()
export class UpdateBlogInput extends PartialType(OmitType(CreateBlogInput, ['authorId'])) {
  @Field(() => String)
  @IsUUID('4')
  id: string;
}
