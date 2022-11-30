import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
// * Entities, types, enums
import { ValidRoles } from '../enums/valid-roles.enum';

export const CurrentUser = createParamDecorator(
  (validRoles: ValidRoles[] = [], context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;

    if (!user) {
      throw new InternalServerErrorException(
        'No User in Request, should implement AuthGuard?',
      );
    }

    // ? Si no se especifica un Rol, se entendera que cualquiera puede acceder
    if (validRoles.length === 0) return user;

    // for (const userRole of [user.role]) {}
    if (validRoles.includes(user.role)) return user;

    throw new ForbiddenException(
      `El Usuario ${user.username} (${user.role}) no esta autorizado para esta accion [${validRoles}]`,
    );
  },
);
