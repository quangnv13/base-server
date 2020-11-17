import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  getCurrentTime,
  isNullOrEmptyOrWhitespace,
  isValidLength,
} from '../utils';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({
    required: true,
    unique: true,
    validate: (value) =>
      !isNullOrEmptyOrWhitespace(value) && isValidLength(value, 6, 50),
  })
  username: string;

  @Prop({
    required: true,
    validate: (value) =>
      !isNullOrEmptyOrWhitespace(value) && isValidLength(value, 6, 500),
  })
  password: string;

  @Prop({
    required: true,
    validate: (value) =>
      !isNullOrEmptyOrWhitespace(value) && isValidLength(value, 6, 500),
  })
  email: string;

  @Prop({
    validate: (value) =>
      !isNullOrEmptyOrWhitespace(value) && isValidLength(value, 1, 500),
  })
  fullname: string;

  @Prop({
    default: false,
  })
  isDelete: boolean;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop({
    default: false,
  })
  isAdmin: boolean;

  @Prop({
    default: getCurrentTime(),
  })
  createTime: number;

  @Prop({
    default: 0,
  })
  updateTime: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
