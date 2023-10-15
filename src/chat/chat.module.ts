import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { UserModule } from '../user/user.module';
import { ChatRepository } from './chat.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schema/chat.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
  ],
  providers: [ChatGateway, ChatService, ChatRepository],
  exports: [ChatService],
})
export class ChatModule {}
