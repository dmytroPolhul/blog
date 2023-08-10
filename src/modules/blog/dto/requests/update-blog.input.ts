import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import {CreateBlogInput} from "./create-blog.input";

@InputType()
export class UpdateBlogInput extends PartialType(CreateBlogInput) {
    @Field(() => String)
    @IsUUID('4')
    id: string;
}
