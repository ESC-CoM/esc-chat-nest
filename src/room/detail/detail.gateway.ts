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

@WebSocketGateway({ namespace: /\/chat-rooms\/.+/ })
export class DetailGateway implements OnGatewayDisconnect, OnGatewayConnection {
  @WebSocketServer()
  public io: Server;

  constructor(private userService: UserService) {}

  @SubscribeMessage('connection')
  @UseGuards(JwtAuthGuard)
  async handleMessage(@ConnectedSocket() client: Socket) {
    client.join(this.getRoomId(client.nsp.name));
    const result = await this.userService.accessToRoom(
      this.getRoomId(client.nsp.name),
      client.handshake.auth.userId,
    );
    this.io.to(this.getRoomId(client.nsp.name)).emit('room-join', {
      id: result.id,
      lastAccessedAt: Math.floor(
        result.rooms[0].lastAccessedAt.getTime() / 1000,
      ),
    });
  }

  private getRoomId(namespace: string) {
    return namespace.split('/')[2];
  }

  handleDisconnect(@ConnectedSocket() client: Socket): any {
    client.leave(this.getRoomId(client.nsp.name));
  }

  handleConnection(client: any, ...args: any[]): any {
    console.log(client);
  }
}
