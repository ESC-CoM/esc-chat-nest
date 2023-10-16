import { ApiProperty } from '@nestjs/swagger';

export class LocationDistrict {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  parent: LocationDistrict;
}
