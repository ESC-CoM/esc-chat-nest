import { Participant } from './team-participant.dto';
import { ApiProperty } from '@nestjs/swagger';

export class Team {
  @ApiProperty()
  id: string;
  @ApiProperty()
  isOwner: boolean;
  @ApiProperty()
  maxParticipantNumber: number;
  @ApiProperty({ type: [Participant] })
  participants: Participant[];
}
