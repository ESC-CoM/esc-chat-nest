import {
  Injectable,
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
} from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ChatModule } from '../chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoom, ChatRoomSchema } from './entity/room.schema';
import { JwtModule } from '@nestjs/jwt';
import { RoomService } from './room.service';
import { ChatRoomRepository } from './room.repository';
import { MeetingService } from './meeting/meeting.service';
import { RoomGateway } from './room.gateway';
import { CustomJwtService } from '../jwt/custom-jwt.service';
import { DetailGateway } from './detail/detail.gateway';
import { RoomController } from './room.controller';
import { NextFunction } from 'express';

@Module({
  imports: [
    UserModule,
    ChatModule,
    MongooseModule.forFeature([
      { name: ChatRoom.name, schema: ChatRoomSchema },
    ]),
    JwtModule.register({
      global: true,
      publicKey: Buffer.from(
        process.env.PUBLIC_KEY.replaceAll('"', '').replaceAll('\\n', '\n'),
      ).toString('utf-8'),
      verifyOptions: {
        algorithms: ['RS512'],
      },
    }),
  ],
  providers: [
    RoomService,
    ChatRoomRepository,
    MeetingService,
    RoomGateway,
    CustomJwtService,
    DetailGateway,
  ],
  controllers: [RoomController],
})
export class RoomModule {}
