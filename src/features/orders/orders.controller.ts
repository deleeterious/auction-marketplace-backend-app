import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDTO } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(AuthGuard())
  @Get(':id')
  getOrder(@Param('id') id: string) {
    return this.ordersService.getOrder(Number(id));
  }

  @UseGuards(AuthGuard())
  @Post()
  createOrder(@Body() data: CreateOrderDTO) {
    return this.ordersService.createOrder(data);
  }

  @UseGuards(AuthGuard())
  @Post(':id')
  updateOrder(@Body() data: Partial<CreateOrderDTO>, @Param('id') id: string) {
    return this.ordersService.updateOrder(data, Number(id));
  }
}
