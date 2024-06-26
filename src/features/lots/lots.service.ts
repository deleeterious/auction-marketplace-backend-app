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

@Injectable()
export class LotsService {
  constructor(@InjectRepository(Lot) private lotsRepository: Repository<Lot>) {}

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

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCrone() {
    await this.lotsRepository
      .createQueryBuilder('lot')
      .update(Lot)
      .set({ status: LotStatus.InProgress })
      .where(
        '"lot"."startTime" <= :dateNow and "lot"."endTime" > :dateNow  and "lot"."status" = :status',
        {
          dateNow: new Date().toISOString(),
          status: LotStatus.Pending,
        },
      )
      .execute();

    await this.lotsRepository
      .createQueryBuilder('lot')
      .update(Lot)
      .set({ status: LotStatus.Closed })
      .where('"lot"."endTime" <= :dateNow  and "lot"."status" = :status', {
        dateNow: new Date().toISOString(),
        status: LotStatus.InProgress,
      })
      .execute();

    const lots = await this.lotsRepository
      .createQueryBuilder('lot')
      .leftJoinAndSelect('lot.bids', 'bids')
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

      await this.lotsRepository.update({ id: lot.id }, { winningBid });
    }
  }
}
