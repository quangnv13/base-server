import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpResult, IHttpResult } from 'src/shared/http-result';
import { UserDto } from 'src/shared/models/user';
import { User, UserDocument } from 'src/shared/schemas/user';
import { UserService } from '../user/user.service';
import { JwtPayload } from './jwt.strategy';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  /**
   *
   */
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(payload: JwtPayload): Promise<UserDocument> {
    const user = await this.userService.findOneById(payload.userId);
    if (!user) {
      throw new HttpException(
        'Token không hợp lệ! Vui lòng đăng nhập lại',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }

  async register(userDto: UserDto): Promise<IHttpResult> {
    userDto.password = await bcrypt.hash(userDto.password, 10);
    let result: IHttpResult;
    try {
      const newUser = await this.userService.createUser(userDto);
      result = HttpResult(true, 'Tạo tài khoản thành công', newUser);
    } catch (error) {
      result = HttpResult(false, '`Tạo tài khoản thất bại!', error);
    }
    return result;
  }

  async isExistUser(userDto: UserDto): Promise<IHttpResult> {
    let result: IHttpResult;
    if (userDto.username) {
      const getUser = await this.userService.findOneByUsername(
        userDto.username,
      );
      if (getUser) {
        result = HttpResult(true, 'Tên đăng nhập hợp lệ');
      } else {
        result = HttpResult(false, 'Tên đăng nhập đã tồn tại');
      }
    }
    return result;
  }

  async login(userDto: UserDto): Promise<IHttpResult> {
    if (!userDto.username || !userDto.password) {
      return HttpResult(false, 'Tài khoản không được để trống');
    }
    const user = await this.userService.findByLogin(userDto);
    if (user) {
      const token = this.createToken(user);
      return HttpResult(true, 'Đăng nhập thành công', {
        user,
        token: token,
      });
    } else {
      return HttpResult(false, 'Tên đăng nhập hoặc mật khẩu không chính xác');
    }
  }

  private createToken(userDto: UserDocument): any {
    const user: JwtPayload = {
      userId: userDto._id,
      username: userDto.username,
    };
    const accessToken = this.jwtService.sign(user);
    return accessToken;
  }
}
