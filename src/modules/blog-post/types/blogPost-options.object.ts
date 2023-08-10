import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { PaginationObject } from '../../../common/shared/objectTypes/pagination.object';
import { SortingObject } from '../../../common/shared/objectTypes/sorting.object';
import { BlogPostFilterObject } from './blogPost-filter.object';

@ObjectType()
export class BlogPostOptions {
  @Field(() => PaginationObject, { nullable: true })
  @IsOptional()
  pagination?: PaginationObject;

  @Field(() => SortingObject, { nullable: true })
  @IsOptional()
  sorting?: SortingObject;

  @Field(() => BlogPostFilterObject, { nullable: true })
  @IsOptional()
  filter?: BlogPostFilterObject;
}
