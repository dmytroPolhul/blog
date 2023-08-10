import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { PaginationObject } from '../../../common/shared/objectTypes/pagination.object';
import { SortingObject } from '../../../common/shared/objectTypes/sorting.object';
import { BlogFilterObject } from './blog-filter.object';

@ObjectType()
export class BlogOptions {
  @Field(() => PaginationObject, { nullable: true })
  @IsOptional()
  pagination?: PaginationObject;

  @Field(() => SortingObject, { nullable: true })
  @IsOptional()
  sorting?: SortingObject;

  @Field(() => BlogFilterObject, { nullable: true })
  @IsOptional()
  filter?: BlogFilterObject;
}
