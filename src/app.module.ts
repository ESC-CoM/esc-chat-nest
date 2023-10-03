import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { RoomModule } from './room/room.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/esc-chat'),
    ChatModule,
    RoomModule,
  ],
})
export class AppModule {}
