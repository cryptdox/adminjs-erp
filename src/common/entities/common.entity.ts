import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Common {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
