import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'net';
import { Server } from 'socket.io';

@WebSocketGateway(3600, {
  cors: ['localhost:3000', 'https://www.meething.net'],
  namespace: 'chat-rooms',
})
export class ChatGateway {
  @WebSocketServer()
  public io: Server;

  handleConnection(client: any) {
    const socketId = client.id;
    this.io.emit('connection', { state: 'success', socketId });
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, query: string) {
    //
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    console.log(data);
    return data;
  }
}
