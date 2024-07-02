import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bid } from './bids.entity';
import { Repository } from 'typeorm';
import { CreateBidDTO } from './dto/cretae-bid.dto';

import { Lot, LotStatus } from '../lots/lot.entity';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid) private bidsRepository: Repository<Bid>,
    @InjectRepository(Lot) private lotsRepository: Repository<Lot>,
  ) {}

  async createBid(data: CreateBidDTO, userId) {
    const { price, lotId } = data;

    const lot = await this.lotsRepository.findOne({ where: { id: lotId } });

    if (lot.status !== LotStatus.InProgress) {
      throw new BadRequestException("Lot isn't started");
    }

    const result = await this.bidsRepository
      .createQueryBuilder('bids')
      .select('MAX("bids"."price")', 'max')
      .getRawOne();

    if (price <= Number(result.max.substring(1))) {
      throw new BadRequestException('Incorrect price');
    }

    const bid = await this.bidsRepository.findOne({
      where: {
        lotId,
        userId,
      },
    });

    if (bid) {
      await this.bidsRepository.update(bid.id, { price });
      return;
    }

    await this.bidsRepository.save({ userId, price, lotId });
  }

  async getLotBids(lotId: number) {
    return await this.bidsRepository.find({
      where: {
        lotId,
      },
    });
  }
}
