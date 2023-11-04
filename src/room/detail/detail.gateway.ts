import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from '../../user/user.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../jwt/jwt.guard';
import { CommonGateway } from '../../common/common.gateway';
import { CustomJwtService } from '../../jwt/custom-jwt.service';
import * as console from 'console';

@WebSocketGateway({ namespace: /\/chat-rooms\/.+/ })
export class DetailGateway
  extends CommonGateway
  implements OnGatewayDisconnect, OnGatewayConnection
{
  constructor(protected jwtService: CustomJwtService) {
    super(jwtService);
  }

  @SubscribeMessage('connection')
  async handleMessage(@ConnectedSocket() client: Socket) {
    // super.han;
    // client.join(this.getRoomId(client));
    // const result = await this.userService.accessToRoom(
    //   this.getRoomId(client.nsp.name),
    //   client.handshake.auth.userId,
    // );
    // this.io.to(this.getRoomId(client.nsp.name)).emit('room-join', {
    //   id: result.id,
    //   lastAccessedAt: Math.floor(
    //     result.rooms[0].lastAccessedAt.getTime() / 1000,
    //   ),
    // });
  }

  protected async getRoomId(client: Socket) {
    return client.nsp.name.split('/')[2];
  }
}
