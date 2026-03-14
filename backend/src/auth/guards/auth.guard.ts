import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedRequest, JwtPayload, RefreshRequest } from '../types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.headers['authorization']
      ?.replace('Bearer ', '')
      .trim();

    if (!token) throw new UnauthorizedException();

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      request.user = { userId: payload.sub, email: payload.email };
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const request = ctx.switchToHttp().getRequest<RefreshRequest>();
    const token = request.cookies.refreshToken;

    if (!token) throw new UnauthorizedException('Missing refresh token');

    return true;
  }
}
