import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { IHttpResult } from 'src/shared/http-result';
import { User } from 'src/shared/models/user';

@Controller('auth')
export class AuthController {
  /**
   *
   */
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() user: User): Promise<IHttpResult> {
    return await this.authService.register(user);
  }

  @Post('login')
  async login(@Body() { username, password }: User): Promise<IHttpResult> {
    return await this.authService.login(username, password);
  }
}
