import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SingUpDTO } from './dto/sing-up.dto';
import { SignInDTO } from './dto/sign-in.dto';
import { ConfirmEmailDTO } from './dto/confirm-email.dto';
import { User } from '../users/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  singUp(@Body() body: SingUpDTO): Promise<User> {
    return this.authService.singUp(body);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/sign-in')
  async login(@Body() body: SignInDTO): Promise<{ accessToken: string }> {
    return await this.authService.signIn(body);
  }

  @Post('confirm')
  async confirm(@Body() confirmationData: ConfirmEmailDTO) {
    const email = await this.authService.decodeConfirmationToken(
      confirmationData.token,
    );
    await this.authService.confirmEmail(email);
  }
}
