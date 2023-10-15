import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../common/entity/base-entity.schema';
import { Meeting } from '../../room/dto';
import { ChatRoom } from '../../room/entity/room.schema';

@Schema()
export class User extends BaseSchema {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  rooms: ChatRoom[];
}
export const UserSchema = SchemaFactory.createForClass(User);
