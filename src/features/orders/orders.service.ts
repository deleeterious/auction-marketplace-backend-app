import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { CreateOrderDTO } from './dto/create-order.dto';
import { Lot, LotStatus } from '../lots/lot.entity';
import { User } from '../users/user.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectRepository(Lot) private lotsRepository: Repository<Lot>,
    private mailerService: MailerService,
  ) {}

  async getOrder(id: number) {
    return this.ordersRepository.findOne({ where: { id } });
  }

  async createOrder(data: CreateOrderDTO, user: User) {
    const { arrivalLocation, arrivalType, lotId } = data;

    const lot = await this.lotsRepository.findOne({
      relations: {
        winningBid: true,
        user: true,
        order: true,
      },
      where: {
        id: lotId,
      },
    });

    if (lot.status !== LotStatus.Closed) {
      throw new BadRequestException("Lot isn't closed");
    }

    if (!lot.winningBid) {
      throw new BadRequestException("Lot don't have winning bid");
    }

    if (lot.winningBid.userId !== user.id) {
      throw new BadRequestException(
        "You don't have permission to order this lot",
      );
    }

    if (lot.order) {
      throw new BadRequestException('Order already created');
    }

    const order = this.ordersRepository.create({
      arrivalLocation,
      arrivalType,
      lotId,
      bidId: lot.winningBid.id,
    });

    await this.ordersRepository.save(order);

    this.mailerService.sendMail({
      to: lot.user.email,
      from: 'test@test.com',
      subject: 'Order created',
      html: `
        <div>
          <p>Order details:</p>
          <ul>
            <li>Arrival location: ${arrivalLocation}</>
            <li>Arrival type: ${arrivalType}</>
          </ul> 
        </div>
      `,
    });

    return order;
  }

  async updateOrder(data: Partial<CreateOrderDTO>, id: number, user: User) {
    const order = await this.ordersRepository.findOne({
      relations: {
        lot: {
          winningBid: true,
        },
      },
      where: { id },
    });

    if (order.lot.winningBid.userId !== user.id) {
      throw new BadRequestException(
        "You don't have permission to update order",
      );
    }

    if (order.status !== OrderStatus.Pending) {
      throw new BadRequestException("Lot isn't in pending status");
    }

    return await this.ordersRepository.update({ id }, data);
  }

  async executeOrder(id: number, user: User) {
    const order = await this.ordersRepository.findOne({
      relations: {
        lot: true,
      },
      where: { id },
    });

    if (order.lot.userId !== user.id) {
      throw new BadRequestException(
        "You don't have permission to execute order",
      );
    }

    return await this.ordersRepository.update(
      { id },
      { status: OrderStatus.Sent },
    );
  }

  async receiveOrder(id: number, user: User) {
    const order = await this.ordersRepository.findOne({
      relations: {
        lot: {
          winningBid: true,
        },
      },
      where: { id },
    });

    if (
      order.lot.winningBid.userId !== user.id &&
      order.status !== OrderStatus.Sent
    ) {
      throw new BadRequestException(
        "You don't have permission to receive order or order isn't send",
      );
    }

    return await this.ordersRepository.update(
      { id },
      { status: OrderStatus.Delivered },
    );
  }
}
