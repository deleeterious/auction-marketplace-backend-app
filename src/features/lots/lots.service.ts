import { ForbiddenException, Injectable } from '@nestjs/common';
import { Lot } from './lot.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLotDTO } from './dto/create-lot.dto';

@Injectable()
export class LotsService {
  constructor(@InjectRepository(Lot) private lotsRepository: Repository<Lot>) {}

  async createLot(data: CreateLotDTO, userId: number): Promise<Lot> {
    const lot = this.lotsRepository.create({ ...data, userId });

    return await this.lotsRepository.save(lot);
  }

  async updateLot(data: Partial<CreateLotDTO>, id: number): Promise<Lot> {
    await this.lotsRepository.update(id, data);
    return this.lotsRepository.findOne({ where: { id } });
  }

  async getLot(id: number, userId: number): Promise<Lot> {
    try {
      return await this.lotsRepository.findOneOrFail({
        where: { id, user: { id: userId } },
      });
    } catch (err) {
      console.log(err);
      throw new ForbiddenException();
    }
  }

  async getLots(userId?: string): Promise<Lot[]> {
    if (userId) {
      return await this.lotsRepository.find({
        where: {
          userId: Number(userId),
        },
      });
    }

    return await this.lotsRepository.find();
  }
}
