import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// * Dependencies
import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongoose';
// * Services
import { UsersService } from '../users/users.service';
// * DTOs
import { LoginInputDto } from './dtos/inputs/login.input';
// * Entities, types, enums
import { AuthResponse } from './types/auth-response.type';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(userId: ObjectId) {
    // signAsync
    return this.jwtService.sign({ id: userId });
  }

  async login(loginInputDto: LoginInputDto): Promise<AuthResponse> {
    // ? Al utilizar el UsersService, ya hay una validación por si no existe
    const user = await this.usersService.findOneByAuthCode(
      loginInputDto.authCode,
    );

    if (!user)
      throw new UnauthorizedException(
        'Su cuenta de Usuario ya no existe, no se puede continuar',
      );

    if (!bcrypt.compareSync(loginInputDto.password, user.password))
      throw new BadRequestException('Contraseña incorrecta');

    if (!user.isActive)
      throw new UnauthorizedException(
        'Su cuenta de Usuario esta deshabilitada, no se puede continuar',
      );

    const token = this.getJwtToken(user._id);

    return {
      token,
      user,
    };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOne(id);

    if (!user)
      throw new UnauthorizedException(
        'Su cuenta de Usuario ya no existe, no se puede continuar',
      );

    if (!user.isActive)
      throw new UnauthorizedException(
        'Su cuenta de Usuario esta deshabilitada, no se puede continuar',
      );

    user.password = undefined;
    return user;
  }

  revalidateToken(user: User): AuthResponse {
    // ? Genera un nuevo Token, puede o no ser necesario mostrarlo,
    // ? pero solamente si la Req ya contiene otro Token existente
    const token = this.getJwtToken(user._id);
    return {
      token,
      user,
    };
  }
}
