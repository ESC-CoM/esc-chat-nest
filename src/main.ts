import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsExceptionFilter } from './socket/socket.filter';
import { JwtAuthGuard } from './jwt/jwt.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new WsExceptionFilter());
  await app.listen(3000);
}
bootstrap();
