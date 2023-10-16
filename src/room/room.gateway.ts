import {
  ConnectedSocket,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CustomJwtService } from '../jwt/custom-jwt.service';
import { instrument } from '@socket.io/admin-ui';
import * as process from 'process';
import * as bcrypt from 'bcryptjs';
import { CONFIG_URL } from '../main';
@WebSocketGateway({
  namespace: '/chat-rooms',
})
export class RoomGateway implements OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  public io;
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

  async afterInit(server: any) {
    const result = await fetch(
      `${CONFIG_URL}/meeting/${process.env.PROFILE}`,
    ).then((result) => result.json());
    const username =
      result.propertySources[1].source['spring.security.user.name'];
    const password = await bcrypt.hash(
      result.propertySources[1].source['spring.security.user.password'],
      await bcrypt.genSalt(),
    );
    instrument(this.io.server, {
      auth: { type: 'basic', username, password },
      mode: process.env.NODE_ENV as 'production' | 'development',
    });
  }
}
