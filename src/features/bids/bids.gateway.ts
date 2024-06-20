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

@WebSocketGateway()
export class BidsGateway {
  @WebSocketServer()
  server: any;

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('send_message')
  listenForMessages(@MessageBody() data: string, @GetUser() user: User) {
    console.log(data);

    this.server.sockets.emit('receive_message', user);
  }
}
