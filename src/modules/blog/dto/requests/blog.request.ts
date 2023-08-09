import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class BlogRequest {
  @Field((type) => String)
  @IsString()
  title: string;

  @Field((type) => String)
  @IsString()
  description: string;
}
