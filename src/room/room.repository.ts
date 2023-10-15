import { BaseRepository } from '../common/mongo.repository';
import { ChatRoom } from './entity/room.schema';
import { Injectable, Logger } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ChatRoomRepository extends BaseRepository<ChatRoom> {
  protected readonly logger: Logger = new Logger(ChatRoomRepository.name);

  constructor(
    @InjectModel(ChatRoom.name) protected model: Model<ChatRoom>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection);
  }
}
