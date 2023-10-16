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
      promises.push(this.repository.upsert({ id }, { rooms: [], id: id })),
    );
    const results: User[] = await Promise.all(promises);
    await this.repository.updateAll(
      {
        id: { $in: results.map((result) => result.id) },
      },
      { $push: { rooms: { room, lastAccessedAt: now() } } },
    );
  }

  public async findByRoomId(roomId: Types.ObjectId) {
    return await this.repository.find({ rooms: roomId });
  }

  public async findById(id: string) {
    return await this.repository.findOne({ id });
  }
}
