import { Module } from '@nestjs/common';
// * Controllers
import { AppController } from './app.controller';
// * Services
import { AppService } from './app.service';
// * Modules
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    // * Libs Modules
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
