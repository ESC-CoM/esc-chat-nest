import { Schema } from '@nestjs/mongoose';
import { BaseSchema } from '../../common/entity/base-entity.schema';

@Schema()
export abstract class Chat extends BaseSchema {}

export class MessageChat extends Chat {
  content: Message;
}

export interface Message {
  message: string;
}
