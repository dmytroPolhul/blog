import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateBlogPostInput {
  @Field((type) => String)
  @IsString()
  title!: string;

  @Field((type) => String)
  @IsString()
  mainText!: string;

  @Field((type) => String)
  @IsString()
  blogId!: string;
}
