import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/shared/models/user';

@Injectable()
export class UserService {
  private readonly users: User[];
  /**
   *
   */
  constructor() {
    this.users = [
      {
        userId: 1,
        username: 'john',
        password: 'changeme',
      },
      {
        userId: 2,
        username: 'chris',
        password: 'secret',
      },
      {
        userId: 3,
        username: 'maria orawa',
        password: 'guess',
      },
    ];
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async findByLogin(
    username: string,
    password: string,
  ): Promise<User | undefined> {
    if (!username || !password) {
      throw new HttpException('Tài khoản không tồn tại!', HttpStatus.NOT_FOUND);
    } else {
      const user = this.users.find(
        (user) => user.username === username && password === password,
      );
      if (user) {
        return user;
      } else {
        throw new HttpException(
          'Sai tên đăng nhập hoặc mật khẩu!',
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }

  async findByPayload({ username }: any): Promise<User> {
    return await this.findOne(username);
  }

  async createUser(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }
}
