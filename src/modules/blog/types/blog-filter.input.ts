import { InputType, Field } from '@nestjs/graphql';
import {IsBoolean, IsOptional, IsUUID} from "class-validator";

@InputType()
export class BlogFilter {
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
