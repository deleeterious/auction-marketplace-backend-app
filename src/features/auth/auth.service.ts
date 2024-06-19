import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SingUpDTO } from './dto/sing-up.dto';
import { User } from '../users/user.entity';
import { SignInDTO } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async singUp(data: SingUpDTO) {
    await this.usersService.createUser(data);
  }

  async signIn(data: SignInDTO): Promise<{ accessToken: string }> {
    const user: User = await this.usersService.findByEmail(data.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password or email does not match');
    }

    const accessToken = await this.jwtService.sign({
      userEmail: user.email,
      userId: user.id,
    });

    return { accessToken };
  }
}
