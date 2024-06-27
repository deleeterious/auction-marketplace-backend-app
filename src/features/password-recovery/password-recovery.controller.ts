import { Body, Controller, Post } from '@nestjs/common';
import { PasswordRecoveryService } from './password-recovery.service';
import { UpdatePasswordDTO } from './dto/updata-password.dto';

@Controller('password-recovery')
export class PasswordRecoveryController {
  constructor(private passwordRecoveryService: PasswordRecoveryService) {}

  @Post()
  createPasswordRecovery(@Body() data: { email: string }) {
    this.passwordRecoveryService.createPasswordRecovery(data.email);
  }

  @Post('update-password')
  updatePassword(@Body() data: UpdatePasswordDTO) {
    this.passwordRecoveryService.updatePassword(data);
  }
}
