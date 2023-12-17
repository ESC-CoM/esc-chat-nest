import { ApiProperty, PickType } from '@nestjs/swagger';
import { RoomDto } from './room.dto';
import { User } from '../../user/schema/user.schema';
import { Chat, Message } from '../../chat/schema/chat.schema';
import * as moment from 'moment-timezone';

export class ChatDto {
  @ApiProperty()
  id: string;
  @ApiProperty({ type: () => PickType(RoomDto, ['id'] as const) })
  room: Pick<RoomDto, 'id'>;
  @ApiProperty({ type: () => PickType(User, ['id'] as const) })
  sender: Pick<User, 'id'>;
  @ApiProperty({ type: () => Message })
  content: Message;
  @ApiProperty()
  createdAt: number;

  constructor(chat: Chat) {
    if (!chat) return;
    this.id = chat._id.toString();
    this.room = { id: chat.room.toString() };
    this.sender = { id: chat.sender.id };
    this.content = chat.content;
    this.createdAt = moment(chat.createdAt.toString()).tz('Asia/Seoul').unix();
  }
}
