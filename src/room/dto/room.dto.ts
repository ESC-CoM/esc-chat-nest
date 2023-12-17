import { ApiProperty, OmitType } from '@nestjs/swagger';
import { MeetingDto } from './meeting.dto';
import { ChatDto } from './chat.dto';
import { ChatRoom } from '../entity/room.schema';
import * as moment from 'moment-timezone';

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
  @ApiProperty()
  myUserId?: string;
  constructor(room: ChatRoom, myId: string, unreadItemCount?: number) {
    this.id = room._id.toString();
    this.meeting = new MeetingDto(room.meeting, myId);
    this.createdAt = moment(room.createdAt.toString()).tz('Asia/Seoul').unix();
    this.lastChat = new ChatDto(room.lastChat);
    this.unreadItemCount = unreadItemCount;
    this.myUserId = myId;
  }
}

export class RoomDetailDto {}
