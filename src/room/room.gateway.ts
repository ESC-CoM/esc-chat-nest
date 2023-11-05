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
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway({
  namespace: '/chat-rooms',
})
export class RoomGateway
  implements OnGatewayDisconnect, OnGatewayInit, OnGatewayConnection
{
  @WebSocketServer()
  public io;

  constructor(protected jwtService: CustomJwtService) {}

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

  protected async getUser(client: Socket) {
    if (!client.handshake.auth.id) {
      client.emit('error', {
        code: 'LOGIN_REQUIRED',
        message: '로그인이 필요합니다.',
      });
      throw new UnauthorizedException({
        code: 'LOGIN_REQUIRED',
        message: '로그인이 필요합니다.',
      });
    }
    return await this.jwtService.verify(client.handshake.query.token as string);
  }

  @SubscribeMessage('connection')
  async connenctEvent(@ConnectedSocket() client: Socket) {
    console.log('connection');
    try {
      const roomId = await this.getRoomId(client);
      client.join(roomId);
      return { event: 'connected', data: client.rooms };
    } catch (e) {
      console.log(e.response);
      client.emit('error', e.response);
    } finally {
      client.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket): Promise<any> {
    console.log('disconnect');
    client.disconnect();
  }

  handleConnection(client: any, ...args: any[]): any {
    console.log('connected');
  }
}
