import { ApiProperty } from '@nestjs/swagger';
import { LocationDistrict } from './location-district.dto';

export class University {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  locationDistrict: LocationDistrict;
}
