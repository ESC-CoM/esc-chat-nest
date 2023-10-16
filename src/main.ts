import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsExceptionFilter } from './socket/socket.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as process from 'process';
export const CONFIG_URL = `${process.env.SCHEME}://${process.env.ESC_CONFIG}`;
export async function bootstrap() {
  const result = await fetch(`${CONFIG_URL}/meeting/default`).then((result) =>
    result.json(),
  );
  const sourceElement = result.propertySources[0].source['cors-list'];
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: sourceElement,
      credentials: true,
    },
  });
  app.useGlobalFilters(new WsExceptionFilter());
  const ioAdapter = new IoAdapter(app);
  app.useWebSocketAdapter(ioAdapter);
  const config = new DocumentBuilder()
    .setTitle('mething-chat')
    .setDescription('미팅 채팅 도메인에 대한 REST API 문서입니다.')
    .setVersion('1.0')
    .addTag('chat')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
