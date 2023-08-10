import {Field, InputType, ObjectType} from '@nestjs/graphql';
import { IsOptional } from "class-validator";
import {Pagination} from "../../../common/shared/pagination.input";
import {Sorting} from "../../../common/shared/sorting.input";
import {BlogFilter} from "./blog-filter.input";

@InputType()
export class FilteringPaginationSorting {
    @Field(() => Pagination, { nullable: true })
    @IsOptional()
    pagination?: Pagination;

    @Field(() => Sorting,{ nullable: true })
    @IsOptional()
    sorting?: Sorting;

    @Field(() => BlogFilter,{ nullable: true })
    @IsOptional()
    filter?: BlogFilter;
}
