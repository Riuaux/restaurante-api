import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
// * Dependencies
import { ExtractJwt, Strategy } from 'passport-jwt';
// * Services
import { AuthService } from '../auth.service';
// * Entities, types, enums
import { User } from '../../users/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class jwtLocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_KEY'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    // ? Aqui sabemos que el User existe, porque estamos validando
    // ? que el Jwt sea correcto, por lo cual llamaremos al
    // ? Service de Auth en lugar del de User.
    const { id } = payload;
    const user = await this.authService.validateUser(id);
    user.password = undefined;
    return user;
  }
}
