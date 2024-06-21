import { UseGuards } from '@nestjs/common';

import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WsJwtGuard } from '../auth/ws-jwt.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/user.entity';
import { BidsService } from './bids.service';
import { CreateBidDTO } from './dto/cretae-bid.dto';

@WebSocketGateway()
export class BidsGateway {
  constructor(private bidsService: BidsService) {}

  @WebSocketServer()
  server: any;

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('create_bid')
  async listenForMessages(@MessageBody() data: string, @GetUser() user: User) {
    const parsedData: CreateBidDTO = JSON.parse(data);

    try {
      await this.bidsService.createBid(parsedData, user.id);
    } catch (err) {
      console.log(err);
    }

    this.server.sockets
      .room('ddda')
      .emit(
        'receive_bids',
        await this.bidsService.getLotBids(parsedData.lotId),
      );
  }
}
