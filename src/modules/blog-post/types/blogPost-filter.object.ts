import { Field, ObjectType} from '@nestjs/graphql';
import {IsBoolean, IsOptional, IsUUID} from "class-validator";

@ObjectType()
export class BlogPostFilterObject {
    @Field({ nullable: true })
    @IsOptional()
    @IsUUID('4')
    blogPostId?: string;
}
