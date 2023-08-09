import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateBlogPostInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
