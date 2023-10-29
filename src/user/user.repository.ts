import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '../common/mongo.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import {
  Connection,
  FilterQuery,
  model,
  Model,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  protected readonly logger: Logger = new Logger(UserRepository.name);

  constructor(
    @InjectModel(User.name) protected model: Model<User>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection);
  }

  public async updateAll(
    filter: FilterQuery<User>,
    command: UpdateQuery<User>,
    option?: QueryOptions<User>,
  ) {
    await this.model.updateMany(filter, command, option);
  }
}
