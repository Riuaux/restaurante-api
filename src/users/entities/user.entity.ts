import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// * Dependencies
import { now, Schema as MongooseSchema } from 'mongoose';

@Schema()
@ObjectType()
export class User {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    unique: true,
    index: true,
    required: true,
  })
  @Field(() => String, { description: 'Código único' })
  authCode: string;

  @Prop({
    unique: true,
    index: true,
    required: true,
  })
  @Field(() => String, { description: 'Nombre de Usuario' })
  username: string;

  @Prop({
    required: true,
    selected: false,
  })
  @Field(() => String, { description: 'Contraseña' })
  password: string;

  @Prop({
    index: true,
    required: true,
  })
  @Field(() => String, { description: 'Nombre(s)' })
  firstName: string;

  @Prop({
    index: true,
    required: true,
  })
  @Field(() => String, { description: 'Apellido(s)' })
  lastName: string;

  @Prop({
    index: true,
    required: true,
  })
  @Field(() => String, { description: 'Núm. de teléfono' })
  phoneNumber: string;

  @Prop({
    default: 'empleado',
  })
  @Field(() => String, { description: 'Puesto', nullable: true })
  role?: string;

  // * =================================================================
  // * Common properties
  // * =================================================================

  @Prop({
    required: true,
    selected: false,
    default: true,
  })
  @Field(() => Boolean, { description: 'Está activo', nullable: true })
  isActive?: boolean;

  @Prop({
    type: Date,
    required: true,
    default: now(),
  })
  @Field(() => String, { description: 'Fecha creación', nullable: true })
  createdAt?: Date;

  @Prop({
    type: Date,
    required: true,
    default: now(),
  })
  @Field(() => String, { description: 'F. últ. modificación', nullable: true })
  updatedAt?: Date;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    autopopulate: true,
    default: null,
  })
  @Field(() => User, {
    description: 'últ. modificación por',
    nullable: true,
  })
  updatedBy?: User;
}

export const UserSchema = SchemaFactory.createForClass(User);
