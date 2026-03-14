import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

export interface RefreshRequest extends Request {
  cookies: { refreshToken?: string };
}
