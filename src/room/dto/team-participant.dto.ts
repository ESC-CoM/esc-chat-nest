import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Major } from './major.dto';

export class SchooleInformation {
  @ApiProperty()
  name: string;
  @ApiProperty()
  isCertificated: boolean;
  @ApiProperty()
  major: Major;
}

export class Participant {
  @ApiProperty()
  id: string;
  @ApiProperty()
  introduce: string;
  @ApiProperty()
  profileImageUrl: string;
  @ApiProperty()
  isOwner: boolean;
  @ApiProperty()
  schoolInformation: SchooleInformation;
  @ApiProperty()
  lastAccessedAt?: number;
}
