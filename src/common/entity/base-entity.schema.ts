import { Prop, Schema } from '@nestjs/mongoose';
import { now, SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true })
export class BaseSchema {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;
  @Prop({ default: () => now() })
  createdAt: Date;

  @Prop({ default: () => now() })
  updatedAt: Date;
}
