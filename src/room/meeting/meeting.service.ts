import { Injectable, NotFoundException } from '@nestjs/common';
import { Meeting } from '../entity/room.schema';

@Injectable()
export class MeetingService {
  private baseUrl = `${process.env.API_URL}/api/v1/meetings`;
  public async find(meetingId: string) {
    const meetings = await this.findByIdIn([meetingId]);
    if (meetings.length == 0) {
      throw new NotFoundException({
        code: 'MEETING_NOT_FOUND',
        message: '과팅을 찾을 수 없습니다.',
      });
    }
    return meetings[0];
  }

  public async findByIdIn(meetingIds: string[]) {
    const result: Meeting[] = await fetch(
      `${this.baseUrl}/list?ids=` +
        meetingIds.reduce(
          (previousValue, currentValue) => `${previousValue},${currentValue}`,
          '',
        ),
      {
        method: 'GET',
      },
    ).then((result) => result.json());
    return result;
  }
}
