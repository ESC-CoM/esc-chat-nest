import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '../common/mongo.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Chat } from './schema/chat.schema';

@Injectable()
export class ChatRepository extends BaseRepository<Chat> {
  protected readonly logger: Logger = new Logger(ChatRepository.name);

  constructor(
    @InjectModel(Chat.name) protected model: Model<Chat>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection);
  }

  public async updateAll(
    filter: FilterQuery<Chat>,
    command: UpdateQuery<Chat>,
  ) {
    await this.model.updateMany(filter, command);
  }
}
