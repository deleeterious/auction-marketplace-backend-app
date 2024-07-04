import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SingUpDTO } from './dto/sing-up.dto';
import { User } from '../users/user.entity';
import { SignInDTO } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async singUp(data: SingUpDTO) {
    const payload = { email: data.email };

    const token = this.jwtService.sign(payload, {
      secret: 'EMAIL CONFIRMATION SUPER SECRET',
      expiresIn: '1d',
    });

    await this.usersService.createUser(data);
    await this.mailerService.sendMail({
      to: data.email,
      subject: 'Email confirmation',
      html: `
        <div>
          <p>Confirmation token</p>
          <p>${token}</p>
        </div>
      `,
    });
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

  public async confirmEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (user.verified) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.usersService.verifyEmail(email);
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: 'EMAIL CONFIRMATION SUPER SECRET',
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async verifyUser(accessToken: string): Promise<User> {
    if (!accessToken) {
      throw new WsException('UnauthorizedException');
    }

    const decodedToken = await this.jwtService.verify(accessToken);

    const user: User = await this.usersService.findById(decodedToken.userId);

    if (!user) {
      throw new WsException('User not found');
    }

    return user;
  }
}
