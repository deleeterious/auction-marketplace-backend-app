import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDTO } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get(':id')
  getOrder(@Param('id') id: string) {
    return this.ordersService.getOrder(Number(id));
  }

  @Post()
  createOrder(@Body() data: CreateOrderDTO) {
    return this.ordersService.createOrder(data);
  }

  @Post(':id')
  updateOrder(@Body() data: Partial<CreateOrderDTO>, @Param('id') id: string) {
    return this.ordersService.updateOrder(data, Number(id));
  }
}
