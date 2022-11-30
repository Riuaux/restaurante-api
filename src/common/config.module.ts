import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production' ? ['.env'] : ['.dev.env'],
      isGlobal: true,
    }),
  ],
})
export class ConfigModule {}
