import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CustomJwtService } from '../jwt/custom-jwt.service';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { UnauthorizedException } from '@nestjs/common';

export abstract class CommonGateway
  implements OnGatewayDisconnect, OnGatewayConnection
{
  @WebSocketServer()
  public io: {
    server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  };

  protected constructor(protected jwtService: CustomJwtService) {}

  protected abstract getRoomId(client: Socket): Promise<string>;

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
