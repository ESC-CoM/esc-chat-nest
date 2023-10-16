import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../common/entity/base-entity.schema';
import { ChatRoom } from '../../room/entity/room.schema';

@Schema()
export class User extends BaseSchema {
  @Prop({ required: true })
  id: string;
  @Prop()
  rooms: { room: ChatRoom; lastAccessedAt: Date; unreadItemCount: number }[];
}
export const UserSchema = SchemaFactory.createForClass(User);
