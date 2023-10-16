import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Team } from './team.dto';
import { Meeting } from '../entity/room.schema';

export class MeetingDto {
  @Prop({ unique: true })
  @ApiProperty()
  id: string;
  @ApiProperty()
  myTeam: Team;
  @ApiProperty()
  otherTeam: Team;
  @ApiProperty()
  createdAt: number;
  constructor(meeting: Meeting, meId: string) {
    this.id = meeting.id;
    this.myTeam = meeting.ownerTeam.participants
      .map((participant) => participant.id)
      .includes(meId)
      ? meeting.ownerTeam
      : meeting.engagedTeam;
    this.otherTeam =
      this.myTeam === meeting.ownerTeam
        ? meeting.engagedTeam
        : meeting.ownerTeam;
    this.createdAt = meeting.createdAt;
  }
}
