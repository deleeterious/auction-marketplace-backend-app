import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { SingUpDTO } from '../auth/dto/sing-up.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async createUser(singUpData: SingUpDTO) {
    const { password, ...data } = singUpData;
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({ password: hashedPass, ...data });

    try {
      await this.usersRepository.save(user);
    } catch (err) {
      if (err.code === '23505') {
        throw new HttpException(
          'Email should be unique',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException('message', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updatePassword(password: string, userId: number) {
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, salt);

    this.usersRepository.update({ id: userId }, { password: hashedPass });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async verifyEmail(email: string) {
    return this.usersRepository.update({ email }, { verified: true });
  }
}
