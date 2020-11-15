import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpResult, IHttpResult } from 'src/shared/http-result';
import { User } from 'src/shared/models/user';
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

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Token không hợp lệ', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async register(user: User): Promise<IHttpResult> {
    let result: IHttpResult;
    try {
      const newUser = await this.userService.createUser(user);
      result = HttpResult(true, 'Tạo tài khoản thành công', newUser);
    } catch (error) {
      result = HttpResult(false, '`Tạo tài khoản thất bại!', error);
    }
    return result;
  }

  async isExistUser(user: User): Promise<IHttpResult> {
    let result: IHttpResult;
    if (user.username) {
      const getUser = await this.userService.findOne(user.username);
      if (getUser) {
        result = HttpResult(true, '');
      } else {
        result = HttpResult(false, '');
      }
    }
    return result;
  }

  async login(username: string, password: string): Promise<IHttpResult> {
    const user = await this.userService.findByLogin(username, password);
    const token = this.createToken(username);
    return HttpResult(true, 'Đăng nhập thành công', {
      user,
      token: token.accessToken,
    });
  }

  private createToken(username: string): any {
    const user: JwtPayload = { username: username };
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn: process.env.EXPIRESIN,
      accessToken,
    };
  }
}
