import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
// * Dependencies
import { IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

@InputType()
export class LoginInputDto {
  // ? Que es lo que se espera recibir de la solicitud?

  // * El authCode (o username, quiza)
  @Field(() => String)
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @Length(6, 6)
  @IsString()
  authCode: string;

  // * Y su password
  @Field(() => String)
  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  password: string;
}
