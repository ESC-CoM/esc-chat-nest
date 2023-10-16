import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../common/entity/base-entity.schema';
import { Meeting } from '../dto';
import { Chat } from '../../chat/schema/chat.schema';
import { Types } from 'mongoose';

@Schema()
export class ChatRoom extends BaseSchema {
  @Prop({ required: true })
  meeting: Meeting;
  @Prop({ type: Types.ObjectId })
  lastChat: Chat;
}
export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
