import { Injectable } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatRepository } from './chat.repository';
import { User } from '../user/schema/user.schema';
import { ChatRoom } from '../room/entity/room.schema';
import { Chat } from './schema/chat.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ChatService {
  constructor(
    private gateway: ChatGateway,
    private repository: ChatRepository,
    @InjectModel(Chat.name) protected model: Model<Chat>,
  ) {}

  public async sendChat(chat: Partial<Chat>) {
    const createdChat = await this.repository.create(chat);
    this.gateway.io
      .to(createdChat.room._id.toString() + '')
      .emit('chat-append', createdChat);
    return createdChat;
  }

  public async searchChat(roomId: string, lastAccessedAt?: Date) {
    return this.model
      .find(
        {
          room: new Types.ObjectId(roomId),
          createdAt: { $gte: lastAccessedAt ? lastAccessedAt : 0 },
        },
        {
          room: true,
          _id: true,
          content: true,
          createdAt: true,
          sender: true,
        },
      )
      .populate('sender');
  }
}
