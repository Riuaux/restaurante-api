1. Generar el Resource, en plural

   > `Cambiar el EndOfLine de LF a CRLF en todos los archivos creados`

   ```
   nest g res resourceNames
   ```

2. Especificar el Model/Schema en la Entity

   > `src\resourceNames\entities\resourceName.entity.ts`

   ```
   import { ObjectType, Field } from '@nestjs/graphql';
   import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
   // * Dependencies
   import { now, Schema as MongooseSchema } from 'mongoose';
   // * Entities
   import { User } from '../../users/entities/user.entity';

   @Schema()
   @ObjectType()
   export class ResourceName {
      @Field(() => String, { description: '' })
      _id: MongooseSchema.Types.ObjectId;

      // ? Agregar aquí las propiedades faltantes

      @Prop({
         unique: true,
         index: true,
         required: true,
      })
      @Field(() => String, { description: 'Nombre del ResourceName' })
      name: string;

      // * =================================================================
      // * Common properties
      // * =================================================================

      @Prop({
         required: true,
         selected: false,
         default: true,
      })
      @Field(() => Boolean, { description: 'Borrado logico' })
      isActive: boolean;

      @Prop({
         type: Date,
         required: true,
         default: now(),
      })
      @Field(() => String, { description: 'Fecha de creación' })
      createdAt: Date;

      @Prop({
         type: Date,
         required: true,
         default: now(),
      })
      @Field(() => String, { description: 'Fecha de última edición' })
      updatedAt: Date;

      @Prop({
         type: MongooseSchema.Types.ObjectId,
         ref: 'User',
         autopopulate: true,
         default: null,
      })
      @Field(() => User, {
         nullable: true,
         description: 'Relación al User que lo modificó por últ. vez',
      })
      updatedBy: User;
   }

   export const ResourceNameSchema = SchemaFactory.createForClass(ResourceName);
   ```

3. Agregar al Module los `Import` y `Export`

   > `src\ResourceNames\ResourceNames.module.ts`

   ```
   import { Module } from '@nestjs/common';
   import { MongooseModule } from '@nestjs/mongoose';
   // * Services, resolvers
   import { ResourceNamesService } from './resourceNames.service';
   import { ResourceNamesResolver } from './resourceNames.resolver';
   // * Entities
   import { ResourceName, ResourceNameSchema } from './entities/resourceName.entity';

   @Module({
      imports: [
         MongooseModule.forFeature([
            {
            name: ResourceName.name,
            schema: ResourceNameSchema,
            },
         ]),
      ],
      exports: [ResourceNamesService],
      providers: [ResourceNamesResolver, ResourceNamesService],
   })
   export class ResourceNamesModule {}
   ```

4. Agregar al `InputDTO Create` las validaciones

   > `src\resourceNames\dto\create-resourceName.input.ts`

   ```
   import { InputType, Field } from '@nestjs/graphql';
   // * Dependencies
   import {
      IsNotEmpty,
      IsOptional,
      IsBoolean,
      IsDate,
      IsMongoId,
   } from 'class-validator';
   // * Entities, types, enums
   import { User } from '../../users/entities/user.entity';

   @InputType()
   export class CreateResourceNameInput {

      // ? Agregar aquí las propiedades faltantes
      // * @Transform(({ value }) => value?.trim())

      // * =================================================================
      // * Common properties
      // * =================================================================

      @Field(() => Boolean, { nullable: true, description: '' })
      @IsOptional()
      @IsBoolean()
      isActive: boolean;

      @Field(() => String, { nullable: true, description: '' })
      @IsOptional()
      @IsNotEmpty()
      @IsDate()
      createdAt: Date;

      @Field(() => String, { nullable: true, description: '' })
      @IsOptional()
      @IsNotEmpty()
      @IsDate()
      updatedAt: Date;

      @Field(() => String, { nullable: true, description: '' })
      @IsOptional()
      @IsMongoId()
      updatedBy: User;
   }
   ```

5. Copiar del `InputDTO Create` las validaciones y los campos relacionales al `InputUpdate Update`, y validar que no pasen como `null`

   > `src\resourceNames\dto\update-resourceName.input.ts`

   ```
   import { CreateResourceNameInput } from './create-resourceName.input';
   import { InputType, Field, PartialType } from '@nestjs/graphql';
   // * Dependencies
   import { IsMongoId } from 'class-validator';
   import { Schema as MongooseSchema } from 'mongoose';
   // * Entities, types, enums
   import { RelationalResName } from '../../relationalResNames/entities/relationalResName.entity';

   @InputType()
   export class UpdateResourceNameInput extends PartialType(CreateResourceNameInput) {
      @Field(() => String, { description: '' })
      @IsMongoId()
      _id: MongooseSchema.Types.ObjectId;

      @Field(() => String, { description: '' })
      @IsMongoId()
      relationalResName: RelationalResName;
   }

   ```

6. Cambiar el tipo de `_id` en el `InputDTO Update`

   > `src\resourceNames\dto\update-resourceName.input.ts`

   ```
   import { CreateResourceNameInput } from './create-resourceName.input';
   import { InputType, Field, PartialType } from '@nestjs/graphql';
   // * Dependencies
   import { IsMongoId } from 'class-validator';
   import { Schema as MongooseSchema } from 'mongoose';

   @InputType()
   export class UpdateResourceNameInput extends PartialType(CreateResourceNameInput) {
      @Field(() => String, { description: '' })
      @IsMongoId()
      _id: MongooseSchema.Types.ObjectId;
   }
   ```

7. Agregar los `CurrentUser`, `UserGuards` y `PaginationArgs` en el `Resolver`; cambiar el tipo de `_id`; y asignar el tipo de retorno a `Promise` y los respectivos `async/await`

   > `src\resourceNames\resourceNames.resolver.ts`

   ```
   import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
   import { UseGuards } from '@nestjs/common';
   // * Services
   import { ResourceNamesService } from './resourceNames.service';
   // * Entities, types, enums
   import { ResourceName } from './entities/resourceName.entity';
   import { User } from '../users/entities/user.entity';
   import { ValidRoles } from '../auth/enums/valid-roles.enum';
   // * DTOs, Inputs, Args
   import { CreateResourceNameInput } from './dto/create-resourceName.input';
   import { UpdateResourceNameInput } from './dto/update-resourceName.input';
   import { PaginationArgs } from '../common/dto/args/pagination.args';
   // * Guards, decorators
   import { CurrentUser } from '../auth/decorators/current-user.decorator';
   import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

   @Resolver(() => ResourceName)
   @UseGuards(JwtAuthGuard)
   export class ResourceNamesResolver {
      constructor(private readonly resourceNamesService: ResourceNamesService) {}

      @Mutation(() => ResourceName, { name: 'createResourceName' })
      async createResourceName(
         @CurrentUser([ValidRoles.admin]) user: User,
         @Args('createResourceNameInput') createResourceNameInput: CreateResourceNameInput,
      ): Promise<ResourceName> {
         return await this.resourceNamesService.create(createResourceNameInput, user._id);
      }

      @Query(() => [ResourceName], { name: 'findAllResourceNames' })
      async findAllResourceNames(
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
         @CurrentUser([ValidRoles.admin]) user: User,
         @Args() paginationArgs: PaginationArgs,
      ): Promise<ResourceName[]> {
         console.log({ paginationArgs });
         return await this.resourceNamesService.findAll(paginationArgs);
      }

      @Query(() => ResourceName, { name: 'findResourceNameById' })
      async findResourceNameById(
         @Args('id', { type: () => String }) id: string,
      ): Promise<ResourceName> {
         return await this.resourceNamesService.findOneById(id);
      }

      @Mutation(() => ResourceName, { name: 'updateResourceName' })
      async updateResourceName(
         @CurrentUser([ValidRoles.admin, ValidRoles.supervisor]) user: User,
         @Args('updateResourceNameInput') updateResourceNameInput: UpdateResourceNameInput,
      ): Promise<ResourceName> {
         return await this.resourceNamesService.update(
            updateResourceNameInput._id,
            updateResourceNameInput,
            user._id,
         );
      }

      @Mutation(() => ResourceName, { name: 'changeResourceNameStatus' })
      async changeResourceNameStatus(
         @CurrentUser([ValidRoles.admin]) user: User,
         @Args('deleteResourceNameInput') deleteResourceNameInput: UpdateResourceNameInput,
         @Args('isActive') isActive: boolean,
      ): Promise<ResourceName> {
         return await this.resourceNamesService.changeStatus(
            deleteResourceNameInput._id,
            isActive,
            user._id,
         );
      }
   }
   ```

8. Agregar las funciones personalizada para hacer `Update` y los `HandleDBErrors`, <s>los `populate()`</s> (se eliminó esta parte a favor del plugin `mongoose-autopopulate`), y los `skip()/limit()` de paginación; y asignar el tipo de retorno a `Promise` y los respectivos `async/await`

   > `src\resourceNames\resourceNames.service.ts`

   ```
   import {
      Injectable,
      InternalServerErrorException,
      Logger,
      NotFoundException,
      UnprocessableEntityException,
   } from '@nestjs/common';
   import { InjectModel } from '@nestjs/mongoose';
   // * Dependencies
   import { Model, ObjectId } from 'mongoose';
   // * DTOs, Inputs, Args
   import { CreateResourceNameInput } from './dto/create-resourceName.input';
   import { UpdateResourceNameInput } from './dto/update-resourceName.input';
   // * Entities, types, enums
   import { ResourceName } from './entities/resourceName.entity';
   import { PaginationArgs } from '../common/dto/args/pagination.args';

   @Injectable()
   export class ResourceNamesService {
      // * Logger
      private readonly logger = new Logger('ResourceNamesService');

      constructor(
         @InjectModel(ResourceName.name)
         private readonly resourceNameModel: Model<ResourceName>,
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
               `Ya existe una ResourceName con '${llave}' igual a '${valor}'`,
            );
            }

            if (error.code === 404) {
            throw new NotFoundException(
               `La ResourceName con '${llave}' igual a '${valor}' no se encontró`,
            );
            }
         }

         this.logger.error(error);
         throw new InternalServerErrorException(
            `Error no configurado, revise los Logs del servidor para más información. ${error}`,
         );
      }

      private async modifyResourceNameData(
         id: ObjectId,
         inputData: UpdateResourceNameInput | object,
         isNew = true,
      ): Promise<ResourceName> {
         const resourceName = await this.resourceNameModel
            .findOneAndUpdate({ _id: id }, inputData, { new: isNew })
            // .populate(['updatedBy'])
            .orFail()
            .catch((error) => {
            this.handleDatabaseError(error);
            });

         return resourceName;
      }

      // * ==================================================
      // * CRUD methods
      // * ==================================================

      async create(
         createResourceNameInput: CreateResourceNameInput,
         loggedUserId: ObjectId,
      ): Promise<ResourceName> {
         try {
            const resourceName = new this.resourceNameModel({
            ...createResourceNameInput,
            updatedBy: loggedUserId,
            });

            const saved = await resourceName.save();

            return await saved; // .populate(['updatedBy']);
         } catch (e) {
            this.handleDatabaseError(e);
         }
      }

      async findAll(pagination?: PaginationArgs): Promise<ResourceName[]> {
         const resourceNames = await this.resourceNameModel
            .find()
            // .populate(['updatedBy'])
            .skip(pagination?.offset)
            .limit(pagination?.limit);
         return resourceNames;
      }

      async findOneById(id: string): Promise<ResourceName> {
         try {
            return await this.resourceNameModel
            .findOne({ _id: id })
            // .populate(['updatedBy'])
            .orFail()
            .exec();
         } catch (error) {
            error.keyValue = { id };
            error.code = +404;
            this.handleDatabaseError(error);
         }
      }

      async update(
         id: ObjectId,
         updateResourceNameInput: UpdateResourceNameInput,
         loggedUserId: ObjectId,
      ): Promise<ResourceName> {
         const existingResourceName = await this.modifyResourceNameData(
            id,
            {
               $set: updateResourceNameInput,
               updatedAt: new Date(),
               updatedBy: loggedUserId,
            },
            true,
         );

         return existingResourceName;
      }

      async changeStatus(
         id: ObjectId,
         isActive: boolean,
         loggedUserId: ObjectId,
      ): Promise<ResourceName> {
         const existingResourceName = await this.modifyResourceNameData(
            id,
            { isActive, updatedAt: new Date(), updatedBy: loggedUserId },
            true,
         );

         return existingResourceName;
      }
   }

   ```

9. Crear el separador `ResourceNames | Aarbolito - Nest` en Apollo GraphQL y agregar las 5 funciones: `Create`, `FindAll`, `FindOneById`, `Update`, `ChangeStatus`. Verificar en la DB el funcionamiento correcto

   > [`Apollo Sandbox`](https://studio.apollographql.com/sandbox/explorer)
