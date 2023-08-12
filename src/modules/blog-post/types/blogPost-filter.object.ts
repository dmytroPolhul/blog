import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

@ObjectType()
export class BlogPostFilterObject {
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID('4')
  blogPostId?: string;
}
