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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  singUp(@Body() body: SingUpDTO) {
    return this.authService.singUp(body);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/sign-in')
  async login(@Body() body: SignInDTO): Promise<{ accessToken: string }> {
    return await this.authService.signIn(body);
  }
}
