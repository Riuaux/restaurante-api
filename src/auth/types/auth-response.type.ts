import { Field, ObjectType } from '@nestjs/graphql';
// * Entities, types, enums
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class AuthResponse {
  // ? Que es lo que el usuario espera recibir como respuesta del server?

  // * Un Token, para validar su inicio de sesion
  @Field(() => String)
  token: string;

  // * Y su info de usuario
  @Field(() => User)
  user: User;
}
