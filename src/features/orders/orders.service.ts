import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { CreateOrderDTO } from './dto/create-order.dto';
import { Lot, LotStatus } from '../lots/lot.entity';
// import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectRepository(Lot) private lotsRepository: Repository<Lot>,
  ) {}

  async getOrder(id: number) {
    return this.ordersRepository.findOne({ where: { id } });
  }

  async createOrder(data: CreateOrderDTO) {
    const { arrivalLocation, arrivalType, lotId } = data;

    const lot = await this.lotsRepository.findOne({
      where: {
        id: lotId,
      },
    });

    if (lot.status !== LotStatus.Closed) {
      throw new BadRequestException("Lot isn't closed");
    }

    const order = this.ordersRepository.create({
      arrivalLocation,
      arrivalType,
      lotId,
      bidId: lot.winningBid.id,
    });

    return await this.ordersRepository.save(order);
  }

  async updateOrder(data: Partial<CreateOrderDTO>, id: number) {
    const order = await this.ordersRepository.findOne({ where: { id } });

    if (order.status !== OrderStatus.Pending) {
      throw new BadRequestException("Lot isn't in pending status");
    }

    return await this.ordersRepository.update({ id }, data);
  }
}
