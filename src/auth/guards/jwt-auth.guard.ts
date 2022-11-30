import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {
  // ! Override default
  // ? Se sobreescribio el metodo del Guard de Passport para que
  // ? use la Request pero desde GraphQL ExecutionContext, ya que
  // ? funciona diferente que en una clasica REST API
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    return request;
  }
}
