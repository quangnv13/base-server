import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from 'src/shared/models/user';
import { User, UserDocument } from 'src/shared/schemas/user';
import * as bcrypt from 'bcrypt';
import { HttpResult, IHttpResult } from 'src/shared/http-result';
@Injectable()
export class UserService {
  /**
   *
   */
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  findOneById(userId: string) {
    return this.userModel.findById(userId);
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({ username: username });
  }

  findOneByUsernameOrEmail(username: string, email: string) {
    return this.userModel.findOne({
      $or: [{ username: username }, { email: email }],
    });
  }

  async findAll(
    filter: UserDto,
    sort: any,
    pageActive: number,
    pageSize: number,
  ): Promise<IHttpResult> {
    if (!sort) {
      sort = { createTime: -1 };
    }

    return HttpResult(true, null, {
      users: await this.userModel
        .find(filter)
        .sort(sort)
        .skip((pageActive - 1) * pageSize)
        .limit(pageSize),
      total: await this.userModel.countDocuments(filter),
    });
  }

  async findByLogin(userDto: UserDto): Promise<UserDocument> {
    const user = await this.userModel.findOne({
      username: userDto.username,
      isDelete: false,
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

  async createUser(userDto: UserDto): Promise<IHttpResult> {
    const user = await this.findOneByUsernameOrEmail(
      userDto.username,
      userDto.email,
    );
    if (user) {
      return HttpResult(
        false,
        'Tên tài khoản hoặc email đã tồn tại trong hệ thống! Vui lòng kiểm tra lại',
      );
    }
    userDto.password = await bcrypt.hash(userDto.password, 10);
    try {
      const newUser = await new this.userModel(userDto).save();
      return HttpResult(true, 'Tạo tài khoản thành công', {
        user: newUser,
      });
    } catch (error) {
      throw new HttpException(
        `Có lỗi xảy ra khi thao tác: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(userDto: UserDto): Promise<IHttpResult> {
    try {
      const newUser = await this.userModel.findOneAndUpdate(
        { _id: userDto.userId },
        userDto,
      );
      return HttpResult(true, null, { user: newUser });
    } catch (error) {
      throw new HttpException(
        `Có lỗi xảy ra khi thao tác: ${JSON.stringify(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(userId: string): Promise<IHttpResult> {
    try {
      await this.userModel.findOneAndUpdate(
        { _id: userId },
        { isDelete: true },
      );
      return HttpResult(true, 'Đã xóa tài khoản');
    } catch (error) {
      throw new HttpException(
        `Có lỗi xảy ra khi thao tác: ${JSON.stringify(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
