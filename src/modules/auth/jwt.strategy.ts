import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/shared/models/user';

export interface JwtPayload {
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   *
   */
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY || 'Phuongchi@123',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    return await this.authService.validateUser(payload);
  }
}
