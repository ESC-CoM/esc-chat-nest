import { Prop, Schema } from '@nestjs/mongoose';
import { Team } from '../../external-dto';
import { BaseSchema } from '../../common/entity/base-entity.schema';

@Schema()
export class Room extends BaseSchema {
  @Prop()
  myTeam: Team;
  @Prop()
  otherTeam: Team;
}
