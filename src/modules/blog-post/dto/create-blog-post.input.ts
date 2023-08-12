import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateBlogPostInput {
  @Field(() => String)
  @IsString()
  title!: string;

  @Field(() => String)
  @IsString()
  mainText!: string;

  @Field(() => String)
  @IsString()
  blogId!: string;
}
