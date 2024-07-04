import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDTO } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/Decorators/get-user.decorator';

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
  createOrder(@Body() data: CreateOrderDTO, @GetUser() user) {
    return this.ordersService.createOrder(data, user);
  }

  @UseGuards(AuthGuard())
  @Patch(':id')
  updateOrder(
    @Body() data: Partial<CreateOrderDTO>,
    @Param('id') id: string,
    @GetUser() user,
  ) {
    return this.ordersService.updateOrder(data, Number(id), user);
  }

  @UseGuards(AuthGuard())
  @Post(':id/execute')
  executeOrder(@Param('id') id: string, @GetUser() user) {
    return this.ordersService.executeOrder(Number(id), user);
  }

  @UseGuards(AuthGuard())
  @Post(':id/receive')
  receiveOrder(@Param('id') id: string, @GetUser() user) {
    return this.ordersService.receiveOrder(Number(id), user);
  }
}
