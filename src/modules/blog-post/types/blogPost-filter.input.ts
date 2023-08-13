import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

@InputType()
export class BlogPostFilter {
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID('4')
  blogPostId?: string;

  @Field({ nullable: true })
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  isPublish?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  tag?: string;
}
