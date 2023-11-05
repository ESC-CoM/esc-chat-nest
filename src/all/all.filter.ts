import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Socket } from 'socket.io';
import { Error } from 'mongoose';
import { WsException } from '@nestjs/websockets';
import e, { Request, Response } from 'express';
import { BaseResponse } from '../common/base-response';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const hostname = request.headers.origin;

    ctx
      .getResponse<Response>()
      .status(exception.getStatus())
      .setHeader('Access-Control-Allow-Origin', hostname)
      .json(new BaseResponse(exception));
  }

  catchWs(exception: WsException, host: ArgumentsHost) {
    console.log('guard error ');
    const client = host.switchToWs().getClient<Socket>();
    client.emit('error', { code: exception.name, message: exception.message });
    client._error({ code: exception.name, message: exception.message });
  }
}
