import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../common/entity/base-entity.schema';
import { Meeting } from '../dto';

@Schema()
export class ChatRoom extends BaseSchema {
  @Prop({ required: true })
  meeting: Meeting;
}
export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
