import { Module } from '@nestjs/common';
import { BidsGateway } from './bids.gateway';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), AuthModule],
  providers: [BidsGateway, BidsService],
  controllers: [BidsController],
})
export class BidsModule {}
