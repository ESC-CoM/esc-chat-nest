import { Injectable } from '@nestjs/common';
import { ChatRoomRepository } from './room.repository';
import { MeetingService } from './meeting/meeting.service';
import { UserService } from '../user/user.service';
import { RoomGateway } from './room.gateway';
import { ChatService } from '../chat/chat.service';
import { FlattenMaps, Types } from 'mongoose';
import { DetailGateway } from './detail/detail.gateway';
import { User } from '../user/schema/user.schema';
import { Meeting } from './entity/room.schema';

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

  public async findDetail(roomId: string) {
    const room = await this.repository.findOne({
      _id: new Types.ObjectId(roomId),
    });
    const meeting = await this.meetingService.find(room.meeting.id);
    const participantIds = this.getParticipantIds(meeting);
    const accessedTimeWithUser = await this.userService.getAccessedTimeWithUser(
      roomId,
      participantIds,
    );
    meeting.ownerTeam.participants.forEach(
      (participant) =>
        (participant.lastAccessedAt = this.getLastAccessedAt(
          accessedTimeWithUser,
          participant.id,
        )),
    );
    meeting.engagedTeam?.participants.forEach(
      (participant) =>
        (participant.lastAccessedAt = this.getLastAccessedAt(
          accessedTimeWithUser,
          participant.id,
        )),
    );
    return { ...room, meeting };
  }

  private getLastAccessedAt(target: FlattenMaps<User>[], userId: string) {
    return Math.floor(
      target
        .find((user) => user.id === userId)
        ?.rooms[0]?.lastAccessedAt.getTime() / 1000,
    );
  }

  private getParticipantIds(meeting: Meeting) {
    const ownerTeamParticipantIds = meeting.ownerTeam.participants.map(
      (participant) => participant.id,
    );
    const engagedTeamParticipantIds = meeting.engagedTeam?.participants.map(
      (participant) => participant.id,
    );
    if (engagedTeamParticipantIds) {
      ownerTeamParticipantIds.push(...engagedTeamParticipantIds);
    }
    return ownerTeamParticipantIds;
  }
  public async create(meetingId: string) {
    const meeting = await this.meetingService.find(meetingId);
    const chatRoom = await this.repository.upsert(
      { 'meeting.id': meeting.id },
      { meeting },
    );
    const participantIds = this.getParticipantIds(meeting);
    await this.userService.addRoom(chatRoom, participantIds);
    this.roomGateway.io
      .in(participantIds)
      .emit('room-append', { ...chatRoom, id: chatRoom._id, meeting });
  }

  public async search(userId: string) {
    const user = await this.userService.findById(userId);
    const rooms = user.rooms.map((room) => room.room);
    const meetings = await this.meetingService.findByIdIn(
      rooms.map((room) => room.meeting.id),
    );
    rooms.forEach(
      (room) =>
        (room.meeting = meetings.find(
          (meeting) => meeting.id === room.meeting.id,
        )),
    );
    return user.rooms;
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
    await this.repository.findOneAndUpdate(
      { _id: room._id },
      { $set: { lastChat: createdChat } },
    );
    this.detailGateway.io.server
      .in(chat.roomId)
      .emit('chat-append', createdChat);
    const sockets = await this.detailGateway.io.server
      .in(chat.roomId)
      .fetchSockets();
    const alreadyIn = sockets.map((socket) => socket.handshake.auth.userId);
    const notIn = users
      .filter((user) => !alreadyIn.includes(user.id))
      .map((user) => user.id);
    await this.userService.unreadItemPlus(notIn, room._id);
    this.roomGateway.io
      .in(users.map((user) => user.id))
      .emit('last-chat-append', createdChat);
  }

  public async searchChat(roomId: string) {
    return await this.chatService.searchChat(roomId);
  }
}
