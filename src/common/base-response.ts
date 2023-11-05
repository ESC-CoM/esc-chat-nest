import { Error } from 'mongoose';
import { HttpException } from '@nestjs/common';
import * as stream from 'stream';

export class BaseResponse<T> {
  private status: number;
  private successId: string;
  private data: T;
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
    } else {
      this.data = data;
      this.successId = 'OK';
    }
  }
}
