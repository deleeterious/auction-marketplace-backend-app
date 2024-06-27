import { Module } from '@nestjs/common';
import { PasswordRecoveryService } from './password-recovery.service';
import { PasswordRecoveryController } from './password-recovery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordRecovery } from './password-recovery.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordRecovery]), UsersModule],
  providers: [PasswordRecoveryService],
  controllers: [PasswordRecoveryController],
})
export class PasswordRecoveryModule {}
