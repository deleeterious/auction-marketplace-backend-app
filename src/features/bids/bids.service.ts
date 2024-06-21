import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bid } from './bids.entity';
import { Repository } from 'typeorm';
import { CreateBidDTO } from './dto/cretae-bid.dto';

@Injectable()
export class BidsService {
  constructor(@InjectRepository(Bid) private bidsRepository: Repository<Bid>) {}

  async createBid(data: CreateBidDTO, userId) {
    const { price, lotId } = data;

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
