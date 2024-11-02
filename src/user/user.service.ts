import { Injectable } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { ChatRoom } from '../room/entity/room.schema';
import { User } from './schema/user.schema';
import { now, Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(private repository: UserRepository) {}

  public async addRoom(room: ChatRoom, userIds: string[]) {
    const promises = [];
    userIds.forEach((id) =>
      promises.push(this.repository.upsert({ id }, { id: id })),
    );
    const results: User[] = await Promise.all(promises);
    await this.repository.updateAll(
      {
        id: { $in: results.map((result) => result.id) },
      },
      { $push: { rooms: { room, lastAccessedAt: now(), unreadItemCount: 0 } } },
    );
  }

  public async unreadItemPlus(ids: string[], roomId: Types.ObjectId) {
    await this.repository.updateAll(
      { id: { $in: ids } },
      { $inc: { 'rooms.$.unreadItemCount': 1 } },
      { arrayFilters: [{ 'element.rooms._id': new Types.ObjectId(roomId) }] },
    );
  }

  public async findByRoomId(roomId: Types.ObjectId) {
    return await this.repository.find({ rooms: roomId });
  }

  public async findById(id: string) {
    const user = await this.repository.findOne({ id });
    return user;
  }

  public async accessToRoom(roomId: string, userId: string) {
    return await this.repository.findOneAndUpdate(
      {
        id: userId,
      },
      {
        $set: {
          'rooms.$[element].lastAccessedAt': now(),
          'rooms.$[element].unreadItemCount': 0,
        },
      },
      {
        arrayFilters: [{ 'element.room._id': new Types.ObjectId(roomId) }],
      },
    );
  }

  public async getAccessedTimeWithUser(roomId: string, userIds: string[]) {
    return await this.repository.find(
      { id: { $in: userIds } },
      {
        id: 1,
        rooms: { $elemMatch: new Types.ObjectId(roomId), lastAccessedAt: 1 },
      },
    );
  }
}
