import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

@ObjectType()
export class BlogFilterObject {
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID('4')
  blogId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID('4')
  authorId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  includePosts?: boolean;
}
