import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateBlogInput {
  @Field(() => String)
  @IsString()
  title!: string;

  @Field(() => String)
  @IsString()
  description!: string;

  @Field(() => String)
  @IsString()
  authorId!: string;
}
