import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { CustomJwtService } from './custom-jwt.service';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: CustomJwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    switch (context.getType()) {
      case 'http':
        const request = context
          .switchToHttp()
          .getRequest<Request & { user: { id: string } }>();
        request.user = await this.jwtService.verify(
          this.extractBearerToken(request.headers.authorization),
        );
        break;
      case 'ws':
        const handshake = context.switchToWs().getClient<Socket>().handshake;
        handshake.auth = await this.jwtService.verify(
          handshake.query.token as string,
        );
        break;
    }
    return true;
  }

  private extractBearerToken(authorizationHeader: string) {
    if (!authorizationHeader) {
      return null;
    }

    const parts = authorizationHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }
    console.log(parts);
    return parts[1];
  }
}
