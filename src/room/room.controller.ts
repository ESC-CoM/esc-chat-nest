import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomDetailDto, RoomDto } from './dto/room.dto';
import { ApiBody, ApiResponse, OmitType } from '@nestjs/swagger';
import { ChatDto } from './dto/chat.dto';
import { Message } from '../chat/schema/chat.schema';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { BaseResponse } from '../common/base-response';

@Controller('/api/v1/chat-rooms')
export class RoomController {
  constructor(private service: RoomService) {}

  @Post()
  @HttpCode(201)
  public async create(@Body() dto: { meetingId: string }) {
    await this.service.create(dto.meetingId);
  }

  @Get('/me')
  @ApiResponse({
    type: [RoomDto],
  })
  @UseGuards(JwtAuthGuard)
  public async find(@Req() request: Request & { user: { id: string } }) {
    const results = await this.service.search(request.user.id);
    return new BaseResponse(
      results.map((result) => {
        return new RoomDto(
          result.room,
          request.user.id,
          result.unreadItemCount,
        );
      }),
    );
  }

  @Get(':id')
  @ApiResponse({ type: OmitType(RoomDto, ['unreadItemCount'] as const) })
  @UseGuards(JwtAuthGuard)
  public async findDetail(
    @Param('id') roomId: string,
    @Req() request: Request & { user: { id: string } },
  ) {
    const chatRoom = await this.service.findDetail(roomId);
    return new BaseResponse(new RoomDto(chatRoom, request.user.id));
  }

  @Post(':id/chats')
  @ApiBody({ type: Message })
  @UseGuards(JwtAuthGuard)
  public async sendMessage(
    @Req() request,
    @Param('id') roomId: string,
    @Body() dto: { message: string },
  ) {
    if (request.user.id == null) {
      throw new UnauthorizedException({
        code: 'LOGIN_REQUIRED',
        message: '로그인이 필요합니다.',
      });
    }
    const chat = await this.service.sendChat({
      ...dto,
      roomId,
      senderId: request.user.id,
    });
    return new BaseResponse(new ChatDto(chat));
  }

  @Get(':id/chats')
  @ApiResponse({ type: [ChatDto] })
  @UseGuards(JwtAuthGuard)
  public async searchChats(
    @Param('id') roomId: string,
    @Query() { page, size }: { page: string; size: string },
  ) {
    const chats = await this.service.searchChat(roomId, {
      page: Number(page),
      size: Number(size),
    });
    const prevPage = Number(page) - 1 < 0 ? 0 : Number(page) - 1;
    const hasPrevious = !!(await this.service.searchChat(roomId, {
      page: prevPage,
      size: 1,
    }));
    const hasNext = !!(await this.service.searchChat(roomId, {
      page: Number(page) + 1,
      size: 1,
    }));
    return new BaseResponse({
      content: chats.map((chat) => new ChatDto(chat)),
      currentPageNumber: page,
      hasNext,
      hasPrevious,
      pageSize: size,
    });
  }
}
