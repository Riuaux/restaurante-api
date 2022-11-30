import { Module } from '@nestjs/common';
// * Modules
import { ConfigModule } from './config.module';
import { GraphqlModule } from './graphql.module';
import { MongoModule } from './mongo.module';

@Module({
  imports: [ConfigModule, GraphqlModule, MongoModule],
  exports: [ConfigModule, GraphqlModule, MongoModule],
})
export class CommonModule {}
