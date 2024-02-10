import { GraphQLBoolean, GraphQLString } from 'graphql/type';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role } from '../../../common/enums/userRole.enum';
import { BaseSchemaFields } from '../../baseModule/objectType/base.objectType';
import { IsEmail } from 'class-validator';

@ObjectType()
export class User extends BaseSchemaFields {
  @Field(() => GraphQLString, { nullable: true })
  firstName!: string;

  @Field(() => GraphQLString, { nullable: true })
  lastName!: string;

  @Field(() => GraphQLString, { nullable: true })
  @IsEmail()
  email!: string;

  @Field(() => GraphQLString, { nullable: true })
  password?: string;

  @Field(() => GraphQLBoolean, { nullable: true, defaultValue: false })
  isActive?: boolean;

  @Field(() => Role, { nullable: true })
  role!: Role;
}

registerEnumType(Role, { name: 'ROLE' });
