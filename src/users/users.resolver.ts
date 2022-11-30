import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
// * Services
import { UsersService } from './users.service';
// * Entities, types, enums
import { User } from './entities/user.entity';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
// * DTOs, Inputs, Args
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PaginationArgs } from '../common/dto/args/pagination.args';
// * Guards, decorators
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User, { name: 'createUser' })
  createUser(
    @CurrentUser([ValidRoles.admin, ValidRoles.manager]) user: User,
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create(createUserInput, user._id);
  }

  @Query(() => [User], { name: 'findAllUsers' })
  findAllUsers(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @CurrentUser([ValidRoles.admin, ValidRoles.manager]) user: User,
    @Args() paginationArgs: PaginationArgs,
  ): Promise<User[]> {
    console.log({ paginationArgs });
    return this.usersService.findAll(paginationArgs);
  }

  @Query(() => User, { name: 'findUserById' })
  findUserById(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @CurrentUser([ValidRoles.admin, ValidRoles.manager]) user: User,
    @Args('id', { type: () => String }) id: string,
  ): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Query(() => User, { name: 'findUserByAuthCode' })
  findUserByAuthCode(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @CurrentUser([ValidRoles.admin, ValidRoles.manager]) user: User,
    @Args('authCode', { type: () => String }) authCode: string,
  ): Promise<User> {
    return this.usersService.findOneByAuthCode(authCode);
  }

  @Mutation(() => User, { name: 'updateUser' })
  updateUser(
    @CurrentUser([ValidRoles.admin, ValidRoles.manager]) user: User,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.update(
      updateUserInput.authCode,
      updateUserInput,
      user._id,
    );
  }

  @Mutation(() => User, { name: 'changeUserStatus' })
  changeUserStatus(
    @CurrentUser([ValidRoles.admin, ValidRoles.manager]) user: User,
    @Args('deleteUserInput') deleteUserInput: UpdateUserInput,
    @Args('isActive') isActive: boolean,
  ): Promise<User> {
    return this.usersService.changeStatus(
      deleteUserInput.authCode,
      isActive,
      user._id,
    );
  }
}
