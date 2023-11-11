import { Error } from 'mongoose';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import * as stream from 'stream';

export class BaseResponse<T> {
  private status: number;
  private successId: string;
  private data: T;
  constructor(data) {
    this.status = 200;
    this.data = data;
    this.successId = 'OK';
  }
}

export class BaseErrorResponse {
  private status: number;
  private errorId: string;
  private message: string;
  constructor(data) {
    if (data instanceof HttpException) {
      const { code, message } = data.getResponse() as object & {
        code: string;
        message: string;
      };
      this.status = data.getStatus();
      this.errorId = code;
      this.message = message;
    }
    if (data instanceof Error) {
      this.status = 500;
      this.errorId = InternalServerErrorException.name;
      this.message = data.message;
    }
  }
}
