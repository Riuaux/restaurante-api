import { Module } from '@nestjs/common';
// * Controllers
import { AppController } from './app.controller';
// * Services
import { AppService } from './app.service';
// * Modules
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // * Libs Modules
    CommonModule,

    // * Common/Misc Modules
    AuthModule,

    // * Functional Modules
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
