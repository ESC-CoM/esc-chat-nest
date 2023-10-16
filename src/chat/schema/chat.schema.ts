import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../common/entity/base-entity.schema';
import { ChatRoom, ChatRoomSchema } from '../../room/entity/room.schema';
import { User, UserSchema } from '../../user/schema/user.schema';
import { now, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
export class Message {
  @ApiProperty()
  message: string;
}
@Schema()
export class Chat extends BaseSchema {
  @Prop({ required: true, ref: ChatRoom.name })
  room: Types.ObjectId;
  @Prop({
    required: true,
    ref: User.name,
  })
  sender: Types.ObjectId;
  @Prop({ type: Message, required: true })
  content: Message;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
