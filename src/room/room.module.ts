import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { ChatRoomRepository } from './room.repository';
import { MeetingService } from './meeting/meeting.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoom, ChatRoomSchema } from './entity/room.schema';
import { RoomGateway } from './room.gateway';
import { CustomJwtService } from '../jwt/custom-jwt.service';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { DetailGateway } from './detail/detail.gateway';
import { ChatModule } from '../chat/chat.module';
import * as process from 'process';

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
console.log(process.env.PUBLIC_KEY.replaceAll('"', '').replaceAll('\\n', '\n'));
