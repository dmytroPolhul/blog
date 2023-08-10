import { ObjectType, Field, Int } from '@nestjs/graphql';

import {Blog} from "../../entities/blog.entity";
import {BlogOptions} from "../../types/options.object";

@ObjectType()
export class BlogsResponse {
    @Field(() => [Blog])
    results: Blog[];

    @Field(() => BlogOptions)
    options: BlogOptions;

    @Field(() => Int)
    total: number;
}
