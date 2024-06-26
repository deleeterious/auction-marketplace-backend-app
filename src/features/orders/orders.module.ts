import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Lot } from '../lots/lot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Lot])],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
