import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Pagination } from '../../../common/shared/pagination.input';
import { Sorting } from '../../../common/shared/sorting.input';
import { BlogPostFilter } from './blogPost-filter.input';

@InputType()
export class BlogPostFilteringPaginationSorting {
  @Field(() => Pagination, { nullable: true })
  @IsOptional()
  pagination?: Pagination;

  @Field(() => Sorting, { nullable: true })
  @IsOptional()
  sorting?: Sorting;

  @Field(() => BlogPostFilter, { nullable: true })
  @IsOptional()
  filter?: BlogPostFilter;
}
