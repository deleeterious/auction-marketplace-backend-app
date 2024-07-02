import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { PasswordRecovery } from './password-recovery.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { MailerService } from '@nestjs-modules/mailer';
import { UpdatePasswordDTO } from './dto/updata-password.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PasswordRecoveryService {
  constructor(
    @InjectRepository(PasswordRecovery)
    private passwordRecoveryRepository: Repository<PasswordRecovery>,
    private usersService: UsersService,
    private mailerService: MailerService,
  ) {}

  async createPasswordRecovery(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException();
    }

    const passwordRecovery = await this.passwordRecoveryRepository.findOne({
      where: { user },
    });

    const token = crypto.randomBytes(64).toString('hex');

    if (passwordRecovery) {
      this.passwordRecoveryRepository.update(
        { id: passwordRecovery.id },
        { token },
      );
    } else {
      this.passwordRecoveryRepository.save({ user, token });
    }

    this.mailerService.sendMail({
      to: user.email,
      from: 'test@test.com',
      subject: `Password recovery`,
      html: `
      <div>
        <p>Recovery token:</p>
        <a>${token}</a>
      </div>
      `,
    });
  }

  async updatePassword(data: UpdatePasswordDTO) {
    const passwordRecovery = await this.passwordRecoveryRepository.findOne({
      relations: {
        user: true,
      },
      where: { token: data.token },
    });

    if (!passwordRecovery) {
      throw new BadRequestException();
    }

    const user = await this.usersService.findById(passwordRecovery.user.id);

    await this.usersService.updatePassword(
      data.password,
      passwordRecovery.user.id,
    );

    this.mailerService.sendMail({
      to: user.email,
      from: 'test@test.com',
      subject: `Password recovery`,
      html: `
      <div>
        <p>Password has been updated</p>
      </div>
      `,
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleDeleteExpiredRecoveries() {
    await this.passwordRecoveryRepository
      .createQueryBuilder('passwordRecovery')
      .delete()
      .from(PasswordRecovery)
      .where(`createdAt + (15 * interval '1 minute') <= current_timestamp`)
      .execute();
  }
}
