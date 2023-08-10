import { ObjectType, Field, Int } from '@nestjs/graphql';
import {BlogPost} from "../../entities/blog-post.entity";
import {BlogPostOptions} from "../../types/blogPost-options.object";

@ObjectType()
export class BlogPostsResponse {
    @Field(() => [BlogPost])
    results: BlogPost[];

    @Field(() => BlogPostOptions)
    options: BlogPostOptions;

    @Field(() => Int)
    total: number;
}
