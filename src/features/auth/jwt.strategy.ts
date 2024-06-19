import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      secretOrKey: 'super secret',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: {
    userEmail: string;
    userId: number;
  }): Promise<User> {
    const user = await this.usersService.findById(payload.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
