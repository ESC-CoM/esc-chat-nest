import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3600, {
  namespace: 'chat-rooms',
})
export class ChatGateway {
  @WebSocketServer()
  public io: Server;

  private logger = new Logger(ChatGateway.name);

  handleConnection(client: any) {
    const socketId = client.id;
    this.io.emit('connection', { state: 'success', socketId });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('room-join')
  handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = data;
    client.join(roomId);
    this.io.emit('room-join', { state: 'success' });
  }

  @SubscribeMessage('room-exit')
  handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = data;
    client.leave(roomId);
    this.io.emit('room-exit', { state: 'success' });
  }
}
