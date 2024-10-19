import { Injectable, NotFoundException } from '@nestjs/common';
import { Meeting } from '../entity/room.schema';
import { API_URL } from '../../main';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MeetingService {
  constructor(private readonly httpService: HttpService) {}

  private baseUrl = `${API_URL}/api/v1/meetings`;

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
    console.log(`${this.baseUrl}/list?ids=`);
    const result = await firstValueFrom(
      this.httpService.get<{ data: Meeting[] }>(
        `${this.baseUrl}/list?ids=` +
          meetingIds.reduce(
            (previousValue, currentValue) => `${previousValue},${currentValue}`,
            '',
          ),
        {
          method: 'GET',
        },
      ),
    ).then((res) => res.data);
    return result.data ?? [];
  }
}
