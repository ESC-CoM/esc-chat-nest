import { Error } from 'mongoose';
import { HttpException } from '@nestjs/common';

export class BaseResponse<T> {
  private status: number;
  private successId: string;
  private data: T;
  private errorId: string;
  private message: string;
  constructor(data) {
    if (data instanceof HttpException) {
      this.status = data.getStatus();
      this.errorId = data.name;
      this.message = data.message;
    } else {
      this.data = data;
      this.successId = 'OK';
    }
  }
}
