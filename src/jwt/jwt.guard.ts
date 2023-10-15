import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { CustomJwtService } from './custom-jwt.service';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: CustomJwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let token;
    if (context.switchToWs().getClient<Socket>().handshake) {
      token = context.switchToWs().getClient<Socket>().handshake
        .headers.authorization;
    } else {
      token = this.extractBearerToken(
        context.switchToHttp().getRequest<Request>().headers['authorization'],
      );
    }
    if (!token) {
      return true;
    }
    const claim = await this.jwtService.verify(token);
    if (claim) {
      const { id } = claim;
      if (context.switchToWs().getClient<Socket>().handshake) {
        const auth = context.switchToWs().getClient<Socket>().handshake.auth;
        auth.userId = id;
      } else {
        context
          .switchToHttp()
          .getRequest<Request & { user: { id: string } }>().user = { id };
      }
      return true;
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

    return parts[1];
  }
}
