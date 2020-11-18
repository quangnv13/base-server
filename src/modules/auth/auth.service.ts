import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpResult, IHttpResult } from 'src/shared/http-result';
import { UserDto } from 'src/shared/models/user';
import { UserDocument } from 'src/shared/schemas/user';
import { UserService } from '../user/user.service';
import { JwtPayload } from './jwt.strategy';
@Injectable()
export class AuthService {
  /**
   *
   */
  constructor(
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
    return await this.userService.createUser(userDto);
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
      if (!user.isActive) {
        return HttpResult(
          false,
          'Tài khoản đang bị khóa! Vui lòng liên hệ chúng tôi để kiểm tra lại',
        );
      }
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
