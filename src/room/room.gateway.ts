import {
  ConnectedSocket,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CustomJwtService } from '../jwt/custom-jwt.service';

@WebSocketGateway({ namespace: '/chat-rooms' })
export class RoomGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  public io: Server;
  constructor(private jwtService: CustomJwtService) {}

  @SubscribeMessage('connection')
  async connenctEvent(@ConnectedSocket() client: Socket) {
    client.join(client.handshake.auth.userId);
    return { event: 'connected', data: client.rooms };
  }
  async handleDisconnect(@ConnectedSocket() client: Socket): Promise<any> {
    const user = await this.jwtService.verify(
      client.handshake.headers.authorization,
    );
    client.leave(user.id);
  }
}
