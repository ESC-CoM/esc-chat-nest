import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Socket } from 'socket.io';
import { Error } from 'mongoose';
import { WsException } from '@nestjs/websockets';
import e from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };
    console.log(exception);
    // if (host.getType() === 'ws') {
    //   throw new WsException({
    //     code: exception.name,
    //     message: exception.message,
    //   });
    // }
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }

  catchWs(exception: WsException, host: ArgumentsHost) {
    console.log('guard error ');
    const client = host.switchToWs().getClient<Socket>();
    client.emit('error', { code: exception.name, message: exception.message });
    client._error({ code: exception.name, message: exception.message });
  }
}
