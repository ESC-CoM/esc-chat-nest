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
import e, { json, Request, response, Response } from 'express';
import { BaseErrorResponse, BaseResponse } from '../common/base-response';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    ctx
      .getResponse<Response>()
      .status(exception instanceof HttpException ? exception.getStatus() : 500)
      .json(new BaseErrorResponse(exception));
  }

  catchWs(exception: WsException, host: ArgumentsHost) {
    console.log('guard error ');
    const client = host.switchToWs().getClient<Socket>();
    client.emit('error', { code: exception.name, message: exception.message });
    client._error({ code: exception.name, message: exception.message });
  }
}
