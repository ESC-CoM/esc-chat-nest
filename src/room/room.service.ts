import { Injectable } from '@nestjs/common';
import { ChatRoomRepository } from './room.repository';
import { MeetingService } from './meeting/meeting.service';
import { UserService } from '../user/user.service';
import { RoomGateway } from './room.gateway';
import { ChatService } from '../chat/chat.service';
import { Types } from 'mongoose';
import { DetailGateway } from './detail/detail.gateway';

@Injectable()
export class RoomService {
  constructor(
    private repository: ChatRoomRepository,
    private meetingService: MeetingService,
    private userService: UserService,
    private roomGateway: RoomGateway,
    private chatService: ChatService,
    private detailGateway: DetailGateway,
  ) {}

  public async create(meetingId: string) {
    const meeting = await this.meetingService.find(meetingId);
    const chatRoom = await this.repository.upsert(
      { 'meeting.id': meeting.id },
      { meeting },
    );
    const ownerTeamParticipantIds = meeting.ownerTeam.participants.map(
      (participant) => participant.id,
    );
    const engagedTeamParticipantIds = meeting.engagedTeam?.participants.map(
      (participant) => participant.id,
    );
    const participantIds = ownerTeamParticipantIds.concat(
      engagedTeamParticipantIds,
    );
    console.log(participantIds);
    await this.userService.addRoom(chatRoom, participantIds);
    this.roomGateway.io
      .in(participantIds)
      .emit('room-append', { ...chatRoom, id: chatRoom._id, meeting });
  }

  public async search(userId: string) {
    const user = await this.userService.findById(userId);
    const rooms = await this.repository.find({ _id: { $in: user.rooms } });
    const meetings = await this.meetingService.findByIdIn(
      rooms.map((room) => room.meeting.id),
    );
    rooms.forEach(
      (room) =>
        (room.meeting = meetings.find(
          (meeting) => meeting.id === room.meeting.id,
        )),
    );
    return rooms;
  }

  public async sendChat(chat: {
    message: string;
    roomId: string;
    senderId: string;
  }) {
    const sender = await this.userService.findById(chat.senderId);
    const room = await this.repository.findOne({
      _id: new Types.ObjectId(chat.roomId),
    });
    const createdChat = await this.chatService.sendChat({
      content: { message: chat.message },
      room: room._id,
      sender: sender._id,
    });
    const users = await this.userService.findByRoomId(room._id);
    this.detailGateway.io.in(chat.roomId).emit('chat-append', createdChat);
    this.roomGateway.io
      .in(users.map((user) => user.id))
      .emit('last-chat-append', createdChat);
  }

  public async searchChat(roomId: string) {
    return await this.chatService.searchChat(roomId);
  }
}
