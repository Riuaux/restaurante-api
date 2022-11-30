import { registerEnumType } from '@nestjs/graphql';

export enum ValidRoles {
  // ? 'Administrador',
  admin = 'admin',
  // ? 'Usuario',
  user = 'user',

  // ? 'Gerente',
  manager = 'manager',
  // ? 'Supervisor',
  supervisor = 'supervisor',
  // ? 'Vendedor',
  seller = 'seller',
  // ? 'Aux. Vendedor',
  sellerAssist = 'sellerAssist',
}

// ? Si no se especifica este 'name', no puede ser usado en
// ? los @Args de los Resolvers
registerEnumType(ValidRoles, {
  name: 'ValidRoles',
  description: 'Roles permitidos para la Enum',
});
