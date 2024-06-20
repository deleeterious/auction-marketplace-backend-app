import { Module } from '@nestjs/common';
import { LotsController } from './lots.controller';
import { LotsService } from './lots.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lot } from './lot.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Lot]),
  ],
  controllers: [LotsController],
  providers: [LotsService],
})
export class LotsModule {}
