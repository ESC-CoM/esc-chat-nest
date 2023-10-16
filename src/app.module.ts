import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { RoomModule } from './room/room.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomJwtService } from './jwt/custom-jwt.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { UserModule } from './user/user.module';
import { HealthController } from './health/health.controller';
import * as process from 'process';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    ChatModule,
    RoomModule,
    UserModule,
  ],
  providers: [
    CustomJwtService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [HealthController],
})
export class AppModule {}
