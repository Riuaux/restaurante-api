import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// * Services, resolvers
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
// * Entities, types, enums
import { User, UserSchema } from './entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  exports: [UsersService],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
