import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export abstract class BaseSchemaFields {
  @Field(() => ID, { nullable: true })
  id!: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field({ nullable: true })
  deletedAt?: Date;
}
