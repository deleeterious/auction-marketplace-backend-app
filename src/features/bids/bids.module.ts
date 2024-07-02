import { Module } from '@nestjs/common';
import { BidsGateway } from './bids.gateway';
import { BidsService } from './bids.service';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './bids.entity';
import { Lot } from '../lots/lot.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Bid, Lot]),
    AuthModule,
  ],
  providers: [BidsGateway, BidsService],
})
export class BidsModule {}
