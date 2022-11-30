import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// * Services, resolvers
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
// * Modules, strategies
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '../common/config.module';
import { jwtLocalStrategy } from './strategies/jwt-local.strategy';

@Module({
  imports: [
    ConfigModule,

    // * Passport & JWT
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // ? Esta parte es similar a la inyeccion de dependencias, como la
      // ? que se monta en el constructor() de los Services
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_KEY'),
        signOptions: { expiresIn: '10h' },
      }),
    }),

    // * Mis Modules
    UsersModule,
  ],
  exports: [jwtLocalStrategy, PassportModule, JwtModule],
  providers: [AuthResolver, AuthService, jwtLocalStrategy],
})
export class AuthModule {}
