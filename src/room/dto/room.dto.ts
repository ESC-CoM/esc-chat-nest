import { ApiProperty, OmitType } from '@nestjs/swagger';
import { MeetingDto } from './meeting.dto';
import { ChatDto } from './chat.dto';
import { ChatRoom } from '../entity/room.schema';

export class RoomDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  meeting: MeetingDto;
  @ApiProperty()
  createdAt: number;
  @ApiProperty()
  lastChat?: ChatDto;
  @ApiProperty()
  unreadItemCount?: number;
  constructor(room: ChatRoom, myId: string, unreadItemCount?: number) {
    this.id = room._id.toString();
    this.meeting = new MeetingDto(room.meeting, myId);
    this.createdAt = Math.floor(room.createdAt.getTime() / 1000);
    this.lastChat = new ChatDto(room.lastChat);
    this.unreadItemCount = unreadItemCount;
  }
}

export class RoomDetailDto {}
