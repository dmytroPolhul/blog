import { GraphQLString } from 'graphql/type';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseSchemaFields } from '../../baseModule/objectType/base.objectType';
import { User } from '../../user/objectTypes/user.objectType';

@ObjectType()
export class Blog extends BaseSchemaFields {
  @Field(() => GraphQLString, { nullable: true })
  title!: string;

  @Field(() => GraphQLString, { nullable: true })
  description!: string;

  @Field(() => GraphQLString, { nullable: false })
  authorId?: string;

  @Field(() => User, { nullable: false })
  author?: User;
}
