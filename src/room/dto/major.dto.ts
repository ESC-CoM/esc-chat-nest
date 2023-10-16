import { ApiProperty } from '@nestjs/swagger';
import { University } from './university.dto';

export class Major {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty({ type: () => University })
  university: University;
}
