import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    /* *
     * https://javascript.plainenglish.io/graphql-nodejs-mongodb-made-easy-with-nestjs-and-mongoose-29f9c0ea7e1d
     * We use forRootAsync in a way that we can load the module asynchronously.
     * Great usage of this is to load .env vars in your module which you can deploy
     * the same code but target to stage/production or any other environments you
     * would like to use.
     */
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_STRING'),
        connectionFactory: async (connection) => {
          connection.plugin(await import('mongoose-autopopulate'));
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MongoModule {}
