import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Team } from '../dto/team.dto';
import { BaseSchema } from '../../common/entity/base-entity.schema';
import { Chat } from '../../chat/schema/chat.schema';
import { Types } from 'mongoose';

@Schema()
export class Meeting {
  @Prop({ unique: true })
  id: string;
  ownerTeam: Team;
  engagedTeam: Team;
  createdAt: number;
}
@Schema()
export class ChatRoom extends BaseSchema {
  @Prop({ required: true })
  meeting: Meeting;
  @Prop({ type: Types.ObjectId })
  lastChat: Chat;
}
export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
