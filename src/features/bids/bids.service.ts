import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bid } from './bids.entity';
import { Repository } from 'typeorm';
import { CreateBidDTO } from './dto/cretae-bid.dto';

import { Lot, LotStatus } from '../lots/lot.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid) private bidsRepository: Repository<Bid>,
    @InjectRepository(Lot) private lotsRepository: Repository<Lot>,
    private mailerService: MailerService,
  ) {}

  async createBid(data: CreateBidDTO, userId) {
    const { price, lotId } = data;

    let currentBid: Bid | null = null;

    const lot = await this.lotsRepository.findOne({
      relations: { user: true },
      where: { id: lotId },
    });

    if (lot.userId === userId) {
      throw new BadRequestException("You cann't create bid for this lot");
    }

    if (lot.status !== LotStatus.InProgress) {
      throw new BadRequestException("Lot isn't started");
    }

    const result = await this.bidsRepository
      .createQueryBuilder('bids')
      .select('MAX("bids"."price")', 'max')
      .getRawOne();

    if (price < result.max || price < lot.currentPrice) {
      throw new BadRequestException('Incorrect price');
    }

    const bid = await this.bidsRepository.findOne({
      relations: { user: true },
      where: {
        lotId,
        userId,
      },
    });

    if (bid) {
      currentBid = bid;
      await this.bidsRepository.update(bid.id, { price });
    } else {
      await this.bidsRepository.save({ userId, price, lotId });
      currentBid = await this.bidsRepository.findOne({
        relations: { user: true },
        where: {
          lotId,
          userId,
        },
      });
    }

    if (price >= lot.estimatedPrice) {
      this.lotsRepository.update(lot.id, {
        status: LotStatus.Closed,
        winningBid: currentBid,
      });

      this.mailerService.sendMail({
        to: lot.user.email,
        from: 'test@test.com',
        subject: `Your lot has been closed`,
        html: `
      <div>
        <p>Lot ${lot.id} closed</p>
        <p>${lot.winningBid ? `Your lot has been sold for $${lot.winningBid.price}` : 'No bids'}</p>
      </div>
      `,
      });

      this.mailerService.sendMail({
        to: currentBid.user.email,
        from: 'test@test.com',
        subject: `Gz!!! Your bid won`,
        html: `
          <div>
            <p>Lot ${lot.id}</p>
          </div>
        `,
      });
    }
  }

  async getLotBids(lotId: number) {
    return await this.bidsRepository.find({
      where: {
        lotId,
      },
    });
  }
}
