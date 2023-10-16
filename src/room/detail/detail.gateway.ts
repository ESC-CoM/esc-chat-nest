import {
  ConnectedSocket,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from '../../user/user.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../jwt/jwt.guard';

@WebSocketGateway({ namespace: /\/chat-rooms\/.+/ })
export class DetailGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  public io: Server;

  constructor(private userService: UserService) {}

  @SubscribeMessage('connection')
  @UseGuards(JwtAuthGuard)
  handleMessage(@ConnectedSocket() client: Socket) {
    client.join(this.getRoomId(client.nsp.name));
    this.userService.accessToRoom(
      this.getRoomId(client.nsp.name),
      client.handshake.auth.userId,
    );
  }

  private getRoomId(namespace: string) {
    return namespace.split('/')[2];
  }

  handleDisconnect(@ConnectedSocket() client: Socket): any {
    client.leave(this.getRoomId(client.nsp.name));
  }
}
