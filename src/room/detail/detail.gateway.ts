import {
  ConnectedSocket,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: /\/chat-rooms\/.+/ })
export class DetailGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  public io: Server;
  @SubscribeMessage('connection')
  handleMessage(@ConnectedSocket() client: Socket) {
    client.join(this.getRoomId(client.nsp.name));
  }

  private getRoomId(namespace: string) {
    return namespace.split('/')[2];
  }

  handleDisconnect(@ConnectedSocket() client: Socket): any {
    client.leave(this.getRoomId(client.nsp.name));
  }
}
