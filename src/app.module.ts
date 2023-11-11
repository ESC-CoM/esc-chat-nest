import {
  Injectable,
  Logger,
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
} from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { RoomModule } from './room/room.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomJwtService } from './jwt/custom-jwt.service';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { UserModule } from './user/user.module';
import { HealthController } from './health/health.controller';
import * as process from 'process';
import { NextFunction, Request, Response } from 'express';
import { WsExceptionFilter } from './socket/socket.filter';
import { AllExceptionsFilter } from './all/all.filter';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    ChatModule,
    RoomModule,
    UserModule,
  ],
  providers: [],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(
        `${method} ${statusCode} - ${originalUrl} - ${ip} - ${userAgent}`,
      );
    });
    next();
  }
}
