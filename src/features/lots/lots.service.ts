import { ForbiddenException, Injectable } from '@nestjs/common';
import { Lot } from './lot.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLotDTO } from './dto/create-lot.dto';
import {
  PaginatedResource,
  Pagination,
} from 'src/common/Decorators/get-pagination-params.decorator';
import { GetLotsFilter } from './types';

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
}
