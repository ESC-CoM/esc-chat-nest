import { Injectable } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatRepository } from './chat.repository';
import { User } from '../user/schema/user.schema';
import { ChatRoom } from '../room/entity/room.schema';
import { Chat } from './schema/chat.schema';
import { Types } from 'mongoose';

@Injectable()
export class ChatService {
  constructor(
    private gateway: ChatGateway,
    private repository: ChatRepository,
  ) {}

  public async sendChat(chat: Partial<Chat>) {
    const createdChat = await this.repository.create(chat);
    this.gateway.io
      .in(createdChat.room._id.toString() + '')
      .emit('chat-append', createdChat);
    return createdChat;
  }

  public async searchChat(roomId: string) {
    return await this.repository.find({ room: new Types.ObjectId(roomId) });
  }
}
