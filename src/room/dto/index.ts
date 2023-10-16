import { Prop, Schema } from '@nestjs/mongoose';
import { ChatRoom } from '../entity/room.schema';
import { BaseSchema } from '../../common/entity/base-entity.schema';
import { Types } from 'mongoose';
import { User } from '../../user/schema/user.schema';
import { Chat, Message } from '../../chat/schema/chat.schema';

@Schema()
export class Meeting {
  @Prop({ unique: true })
  id: string;
  ownerTeam: Team;
  engagedTeam: Team;
  createdAt: number;
}
export class Team {
  id: string;
  isOwner: boolean;
  maxParticipantNumber: number;
  participants: Participant[];
}
@Schema()
export class Participant {
  @Prop({ unique: true })
  id: string;
  introduce: string;
  profileImageUrl: string;
  isOwner: boolean;
  schoolInformation: {
    name: string;
    isCertificated: boolean;
    major: Major;
  };
}
export class Major {
  id: number;
  name: string;
  university: University;
}
export class University {
  id: number;
  name: string;
  locationDistrict: LocationDistrict;
}
export class LocationDistrict {
  id: number;
  name: string;
  parent: LocationDistrict;
}

export class MeetingDto {
  @Prop({ unique: true })
  id: string;
  myTeam: Team;
  otherTeam: Team;
  createdAt: number;
  constructor(meeting: Meeting, meId: string) {
    this.id = meeting.id;
    this.myTeam = meeting.ownerTeam.participants
      .map((participant) => participant.id)
      .includes(meId)
      ? meeting.ownerTeam
      : meeting.engagedTeam;
    this.otherTeam =
      this.myTeam === meeting.ownerTeam
        ? meeting.engagedTeam
        : meeting.ownerTeam;
    this.createdAt = meeting.createdAt;
  }
}

export class RoomDto {
  id: string;
  meeting: MeetingDto;
  createdAt: number;
  lastChat: ChatDto;
  unreadItemCount: number;
  constructor(room: ChatRoom, unreadItemCount: number, myId: string) {
    this.id = room._id.toString();
    this.meeting = new MeetingDto(room.meeting, myId);
    this.createdAt = Math.floor(room.createdAt.getTime() / 1000);
    this.lastChat = new ChatDto(room.lastChat);
    this.unreadItemCount = unreadItemCount;
  }
}

export class ChatDto {
  id: string;
  room: Pick<RoomDto, 'id'>;
  sender: Pick<User, 'id'>;
  content: Message;
  createdAt: number;
  constructor(chat: Chat) {
    if (!chat) return;
    this.id = chat._id.toString();
    this.room = { id: chat.room.toString() };
    this.sender = { id: chat.sender.toString() };
    this.content = chat.content;
    this.createdAt = Math.floor(chat.createdAt.getTime() / 1000);
  }
}
