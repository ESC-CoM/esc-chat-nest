import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { MeetingDto, RoomDto } from './dto';

@Controller('/api/v1/chat-rooms')
export class RoomController {
  constructor(private service: RoomService) {}

  @Post()
  @HttpCode(201)
  public async create(@Body() dto: { meetingId: string }) {
    await this.service.create(dto.meetingId);
  }

  @Get('/me')
  public async find(@Req() request: Request & { user: { id: string } }) {
    const results = await this.service.search(request.user.id);
    return results.map((result) => {
      return new RoomDto(result, request.user.id);
    });
  }

  @Post(':id/chats')
  public async sendMessage(
    @Req() request: Request & { user: { id: string } },
    @Param('id') roomId: string,
    @Body() dto: { message: string },
  ) {
    if (request.user.id == null) {
      throw new UnauthorizedException({
        code: 'LOGIN_REQUIRED',
        message: '로그인이 필요합니다.',
      });
    }
    await this.service.sendChat({
      ...dto,
      roomId,
      senderId: request.user.id,
    });
  }

  @Get(':id/chats')
  public async searchChats(@Param('id') roomId) {
    const chats = await this.service.searchChat(roomId);
    return chats;
  }
}
