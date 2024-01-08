import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import * as bcrypt from 'bcryptjs';
import { CONFIG_URL } from '../main';
import { CommonGateway } from '../common/common.gateway';
import { CustomJwtService } from '../jwt/custom-jwt.service';
import * as process from 'process';

@WebSocketGateway({
  namespace: '/chat-rooms',
})
export class RoomGateway
  extends CommonGateway
  implements OnGatewayDisconnect, OnGatewayInit, OnGatewayConnection
{
  constructor(protected jwtService: CustomJwtService) {
    super(jwtService);
  }

  protected async getRoomId(client: Socket) {
    const user = await this.getUser(client);
    return user.id;
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
