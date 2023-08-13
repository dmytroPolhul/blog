import { InputType, Field } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateBlogPostInput {
  @Field(() => String)
  @IsString()
  title!: string;

  @Field(() => String)
  @IsString()
  mainText!: string;

  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  isPublish!: boolean;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags?: string[];

  @Field(() => String)
  @IsString()
  blogId!: string;
}
