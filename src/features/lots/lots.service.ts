import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Lot, LotStatus } from './lot.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLotDTO } from './dto/create-lot.dto';
import {
  PaginatedResource,
  Pagination,
} from 'src/common/Decorators/get-pagination-params.decorator';
import { GetLotsFilter } from './types';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(Lot) private lotsRepository: Repository<Lot>,
    private mailerService: MailerService,
  ) {}

  async createLot(data: CreateLotDTO, userId: number): Promise<Lot> {
    const lot = this.lotsRepository.create({ ...data, userId });

    return await this.lotsRepository.save(lot);
  }

  async updateLot(data: Partial<CreateLotDTO>, id: number): Promise<Lot> {
    const lot = await this.lotsRepository.findOne({ where: { id } });
    if (lot.status !== LotStatus.Pending) {
      throw new BadRequestException('Incorrect status');
    }
    await this.lotsRepository.update(id, data);
    return lot;
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

  async getLots(
    { page, limit, size, offset }: Pagination,
    filter: GetLotsFilter | undefined,
    userId: number,
  ): Promise<PaginatedResource<Lot>> {
    // const findOptions: FindManyOptions<Lot> = {
    //   take: limit,
    //   skip: offset,
    // };

    // if (filter?.relation === 'created') {
    //   findOptions.where = {
    //     userId,
    //   };
    // }

    // if (filter?.relation === 'participation') {
    //   findOptions.relations = {
    //     bids: true,
    //   };

    //   findOptions.where = {
    //     bids: {
    //       userId: Number(userId),
    //     },
    //   };
    // }

    // const [data, total] = await this.lotsRepository.findAndCount(findOptions);

    const query = this.lotsRepository
      .createQueryBuilder('lot')
      .leftJoinAndSelect('lot.order', 'order')
      .take(limit)
      .skip(offset);

    if (filter?.relation === 'created') {
      query.where('"userId" = :userId', { userId });
    }

    if (filter?.relation === 'participation') {
      query
        .leftJoin('lot.bids', 'bids')
        .where('"bids"."userId" = :userId', { userId });
    }

    const [data, total] = await query.getManyAndCount();

    return {
      total,
      data,
      page,
      size,
    };
  }

  private async startLots() {
    await this.lotsRepository
      .createQueryBuilder('lot')
      .update(Lot)
      .set({ status: LotStatus.InProgress })
      .where(
        '"lot"."startTime" <= current_timestamp and "lot"."endTime" > current_timestamp  and "lot"."status" = :status',
        {
          status: LotStatus.Pending,
        },
      )
      .execute();
  }

  private async closeLots() {
    const lots = await this.lotsRepository
      .createQueryBuilder('lot')
      .leftJoinAndSelect('lot.user', 'user')
      .where(
        '"lot"."endTime" <= current_timestamp  and "lot"."status" = :status',
        {
          status: LotStatus.InProgress,
        },
      )
      .getMany();

    for (const lot of lots) {
      this.lotsRepository.update(lot.id, { status: LotStatus.Closed });

      this.mailerService.sendMail({
        to: lot.user.email,
        from: 'test@test.com',
        subject: `Your lot is closed`,
        html: `
      <div>
        <p>Lot ${lot.id} closed</p>
      </div>
      `,
      });
    }
  }

  private async setWinningBid() {
    const lots = await this.lotsRepository
      .createQueryBuilder('lot')
      .leftJoinAndSelect('lot.bids', 'bids')
      .leftJoinAndSelect('lot.user', 'user')
      .where('"lot"."winningBidId" is NULL and "lot"."status" = :status', {
        status: LotStatus.Closed,
      })
      .andWhere('"bids"."price" is not NULL')
      .getMany();

    for (const lot of lots) {
      const winningBid = lot.bids.reduce((acc, item) => {
        if (item.price > acc.price) {
          return item;
        }

        return acc;
      }, lot.bids[0]);

      this.mailerService.sendMail({
        to: winningBid.user.email,
        from: 'test@test.com',
        subject: `Gz!!! Your bid won`,
        html: `
          <div>
            <p>Lot ${lot.id}</p>
          </div>
        `,
      });

      await this.lotsRepository.update({ id: lot.id }, { winningBid });
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCrone() {
    await this.startLots();

    await this.closeLots();

    await this.setWinningBid();
  }
}
