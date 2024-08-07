import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LotsService } from './lots.service';
import { GetUser } from '../../common/Decorators/get-user.decorator';
import { CreateLotDTO } from './dto/create-lot.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  GetPaginationParams,
  Pagination,
} from 'src/common/Decorators/get-pagination-params.decorator';
import { GetFilterParams } from 'src/common/Decorators/get-filter-params.decorator';
import { GetLotsFilter } from './types';
import { User } from '../users/user.entity';
import { UpdateLotDTO } from './dto/update-lot.dto';

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
    @Body() body: UpdateLotDTO,
    @GetUser() user: User,
  ) {
    return await this.lotsService.updateLot(body, Number(id), user);
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  async deleteLot(@Param('id') id: string, @GetUser() user: User) {
    return await this.lotsService.deleteLot(Number(id), user);
  }

  @UseGuards(AuthGuard())
  @Get(':id')
  async getLot(@Param('id') id: string, @GetUser() user: User) {
    return await this.lotsService.getLot(Number(id), user.id);
  }

  @UseGuards(AuthGuard())
  @Get()
  async getLots(
    @GetUser() user: User,
    @GetPaginationParams() pagination: Pagination,
    @GetFilterParams() filter: GetLotsFilter | undefined,
  ) {
    return await this.lotsService.getLots(pagination, filter, user.id);
  }
}
