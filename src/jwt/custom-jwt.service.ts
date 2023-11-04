import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import e from 'express';
@Injectable()
export class CustomJwtService {
  constructor(private readonly jwtService: JwtService) {}

  async sign(payload: Record<string, any>): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async verify(token: string): Promise<{ id: string }> {
    try {
      return await this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException({
        code: 'LOGIN_REQUIRED',
        message: '로그인이 필요합니다.',
      });
    }
  }
}
