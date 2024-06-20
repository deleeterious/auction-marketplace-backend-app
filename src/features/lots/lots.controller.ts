import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LotsService } from './lots.service';
import { GetUser } from '../auth/get-user.decorator';
import { CreateLotDTO } from './dto/create-lot.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('lots')
export class LotsController {
  constructor(private lotsService: LotsService) {}

  @UseGuards(AuthGuard())
  @Post()
  async createLot(@Body() body: CreateLotDTO, @GetUser() user) {
    return await this.lotsService.createLot(body, user.id);
  }

  @UseGuards(AuthGuard())
  @Patch(':id')
  async updateLot(
    @Param('id') id: string,
    @Body() body: Partial<CreateLotDTO>,
  ) {
    return await this.lotsService.updateLot(body, Number(id));
  }

  @UseGuards(AuthGuard())
  @Get(':id')
  async getLot(@Param('id') id: string, @GetUser() user) {
    return await this.lotsService.getLot(Number(id), user.id);
  }

  @UseGuards(AuthGuard())
  @Get()
  async getLots(@Query('userId') userId: string) {
    return await this.lotsService.getLots(userId);
  }
}
