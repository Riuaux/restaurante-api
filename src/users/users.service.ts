import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
// * Dependencies
import * as bcrypt from 'bcrypt';
import { Model, ObjectId } from 'mongoose';
// * DTOs, Inputs, Args
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PaginationArgs } from '../common/dto/args/pagination.args';
// * Entities, types, enums
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  // * Logger
  private logger = new Logger('UsersService');

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  // * ==================================================
  // * Private methods
  // * ==================================================

  private handleDatabaseError(error: any): never {
    if ('keyValue' in error) {
      this.logger.warn(`${error.code} : ${error}`);

      const llave = Object.keys(error.keyValue);
      const valor = Object.values(error.keyValue);

      if (error.code === 11000) {
        throw new UnprocessableEntityException(
          `Ya existe un Usuario con '${llave}' igual a '${valor}'`,
        );
      }

      if (error.code === 404) {
        throw new NotFoundException(
          `El Usuario con '${llave}' igual a '${valor}' no se encontró`,
        );
      }
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      `Error no configurado, revise los Logs del servidor para más información. ${error}`,
    );
  }

  private async modifyUserData(
    authCode: string,
    inputData: UpdateUserInput | object,
    isNew = true,
  ): Promise<User> {
    const user = await this.userModel
      .findOneAndUpdate({ authCode }, inputData, { new: isNew })
      .orFail()
      .catch((error) => {
        this.handleDatabaseError(error);
      });

    return user;
  }

  // * ==================================================
  // * CRUD methods
  // * ==================================================

  async create(
    createUserInput: CreateUserInput,
    loggedUserId: ObjectId,
  ): Promise<User> {
    try {
      const user = new this.userModel({
        ...createUserInput,
        password: bcrypt.hashSync(
          createUserInput.password,
          +this.configService.get('BCRYPT_SALT'),
        ),
        updatedBy: loggedUserId,
      });

      return await user.save();
    } catch (e) {
      this.handleDatabaseError(e);
    }
  }

  async findAll(pagination?: PaginationArgs): Promise<User[]> {
    const users = await this.userModel
      .find()
      .skip(pagination.offset)
      .limit(pagination.limit)
      .exec();
    return users;
  }

  async findOne(id: string): Promise<User> {
    try {
      return await this.userModel.findOne({ _id: id }).orFail().exec();
    } catch (error) {
      error.keyValue = { authCode: id };
      error.code = +404;
      this.handleDatabaseError(error);
    }
  }

  async findOneByAuthCode(authCode: string): Promise<User> {
    try {
      return await this.userModel.findOne({ authCode }).orFail().exec();
    } catch (error) {
      error.keyValue = { authCode: authCode };
      error.code = +404;
      this.handleDatabaseError(error);
    }
  }

  async update(
    authCode: string,
    updateUserInput: UpdateUserInput,
    loggedUserId: ObjectId,
  ): Promise<User> {
    // ? If Input has password, re-hash it
    if (updateUserInput.password) {
      updateUserInput = {
        ...updateUserInput,
        password: bcrypt.hashSync(
          updateUserInput.password,
          +this.configService.get('BCRYPT_SALT'),
        ),
      };
    }

    const existingUser = await this.modifyUserData(
      authCode,
      {
        $set: updateUserInput,
        updatedAt: new Date(),
        updatedBy: loggedUserId,
      },
      true,
    );

    return existingUser;
  }

  async changeStatus(
    authCode: string,
    isActive: boolean,
    loggedUserId: ObjectId,
  ): Promise<User> {
    const existingUser = await this.modifyUserData(
      authCode,
      { isActive, updatedAt: new Date(), updatedBy: loggedUserId },
      true,
    );

    return existingUser;
  }
}
