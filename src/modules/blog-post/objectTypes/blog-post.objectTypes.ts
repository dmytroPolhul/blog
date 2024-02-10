import { ObjectType, Field } from '@nestjs/graphql';
import { BaseSchemaFields } from '../../baseModule/objectType/base.objectType';
import { Blog } from '../../blog/objectTypes/blog.objectType';

@ObjectType()
export class BlogPost extends BaseSchemaFields {
  @Field(() => String)
  title: string;

  @Field(() => String)
  mainText: string;

  @Field(() => Boolean)
  isPublish: boolean;

  @Field(() => [String])
  tags?: string[];

  @Field(() => Blog)
  blog?: Blog;
}
