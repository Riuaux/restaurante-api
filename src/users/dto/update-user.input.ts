import { InputType, Field, PartialType } from '@nestjs/graphql';
// * Dependencies
// import { IsMongoId } from 'class-validator';
// * DTOs, Inputs, Args
import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => String)
  // @IsMongoId()
  // _id: string;
  authCode: string;
}
