import { InputType, Field } from '@nestjs/graphql';
// * Dependencies
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
// * DTOs, Inputs, Args
import { User } from '../entities/user.entity';
// * Entities, types, enums
import { ValidRoles } from '../../auth/enums/valid-roles.enum';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'Código único' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  authCode: string;

  @Field(() => String, { description: 'Nombre de Usuario' })
  @Transform(({ value }) => value?.toUpperCase().trim())
  @IsString()
  @IsNotEmpty()
  @Length(4, 24)
  username: string;

  @Field(() => String, { description: 'Contraseña' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @Length(5, 18)
  password: string;

  @Field(() => String, { description: 'Nombre(s)' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @Length(4, 32)
  firstName: string;

  @Field(() => String, { description: 'Apellido(s)' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @Length(4, 32)
  lastName: string;

  @Field(() => String, { description: 'Núm. de teléfono' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @Length(10, 10)
  phoneNumber: string;

  @Field(() => String, { description: 'Puesto', nullable: true })
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(2, 18)
  @IsEnum(ValidRoles)
  role?: string;

  // * =================================================================
  // * Common properties
  // * =================================================================

  @Field(() => Boolean, { description: 'Está activo', nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field(() => String, { description: 'Fecha creación', nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  createdAt?: Date;

  @Field(() => String, { description: 'F. últ. modificación', nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  updatedAt?: Date;

  @Field(() => String, { description: 'últ. modificación por', nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  updatedBy?: User;
}
