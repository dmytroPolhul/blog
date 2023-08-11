import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateBlogInput {
  @Field((type) => String)
  @IsString()
  title!: string;

  @Field((type) => String)
  @IsString()
  description!: string;

  @Field((type) => String)
  @IsString()
  authorId!: string;
}
