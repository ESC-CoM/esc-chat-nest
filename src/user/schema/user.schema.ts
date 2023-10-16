import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../common/entity/base-entity.schema';
import { Meeting } from '../../room/dto';
import { ChatRoom } from '../../room/entity/room.schema';

@Schema()
export class User extends BaseSchema {
  @Prop({ required: true })
  id: string;
  @Prop()
  rooms: { room: ChatRoom; lastAccessedAt: Date }[];
}
export const UserSchema = SchemaFactory.createForClass(User);
