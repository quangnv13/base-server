import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from 'src/shared/models/user';
import { User, UserDocument } from 'src/shared/schemas/user';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  /**
   *
   */
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOneById(userId: string): Promise<UserDocument> {
    return this.userModel.findById(userId);
  }

  async findOneByUsername(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username: username });
  }

  async findByLogin(userDto: UserDto): Promise<UserDocument> {
    const user = await this.userModel.findOne({
      username: userDto.username,
    });
    if (!user) {
      return null;
    }
    const isPasswordMatching = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (isPasswordMatching) {
      return user;
    }
    return null;
  }

  async createUser(userDto: UserDto): Promise<UserDocument> {
    try {
      const newUser = await new this.userModel(userDto);
      return newUser.save();
    } catch (error) {
      throw new HttpException(
        `Có lỗi xảy ra khi thao tác: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(userDto: UserDto): Promise<UserDocument> {
    try {
      const currentUser = await this.findOneById(userDto.userId);
      if (!currentUser) {
        throw new HttpException(
          'Tài khoản không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
      return await currentUser.updateOne(userDto);
    } catch (error) {
      throw new HttpException(
        `Có lỗi xảy ra khi thao tác: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(userDto: UserDto) {
    try {
      const currentUser = await this.findOneById(userDto.userId);
      if (!currentUser) {
        throw new HttpException(
          'Tài khoản không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
      return await currentUser.deleteOne();
    } catch (error) {
      throw new HttpException(
        `Có lỗi xảy ra khi thao tác: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
