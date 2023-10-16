import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../common/entity/base-entity.schema';
import { Meeting } from '../dto';
import { Chat } from '../../chat/schema/chat.schema';

@Schema()
export class ChatRoom extends BaseSchema {
  @Prop({ required: true })
  meeting: Meeting;
  lastChat: Chat;
}
export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
