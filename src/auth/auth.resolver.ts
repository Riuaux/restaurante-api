import { UseGuards } from '@nestjs/common';
import { Query } from '@nestjs/graphql';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
// * Guards, decorators
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
// * Services
import { AuthService } from './auth.service';
// * DTOs
import { LoginInputDto } from './dtos/inputs/login.input';
// * Entities, types, enums
import { AuthResponse } from './types/auth-response.type';
import { User } from '../users/entities/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'Login' })
  async login(
    // ? "Args" engloba la info que viene en la peticion
    @Args('loginInput') loginInput: LoginInputDto,
  ): Promise<AuthResponse> {
    return await this.authService.login(loginInput);
  }

  @Query(() => AuthResponse, { name: 'Revalidate' })
  @UseGuards(JwtAuthGuard)
  revalidateToken(
    // ? Custom Decorator para validacion de sesiones
    @CurrentUser() user: User,
  ): AuthResponse {
    return this.authService.revalidateToken(user);
  }
}
