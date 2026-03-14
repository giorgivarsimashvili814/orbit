import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types';
import { randomBytes, createHash } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('Email is taken');

    const password = await bcrypt.hash(dto.password, 10);

    await this.prisma.user.create({ data: { email: dto.email, password } });
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const { accessToken, refreshToken } = await this.issueTokens(
      user.id,
      user.email,
    );

    return {
      user: { id: user.id, email: user.email },
      accessToken,
      refreshToken,
    };
  }

  async refresh(token: string) {
    const session = await this.prisma.session.findUnique({
      where: { tokenHash: this.hashToken(token) },
      include: { user: { select: { email: true } } },
    });

    if (!session) throw new ForbiddenException('Invalid session');

    if (session.expiresAt < new Date()) {
      await this.prisma.session.delete({ where: { id: session.id } });
      throw new ForbiddenException('Session expired');
    }

    await this.prisma.session.delete({ where: { id: session.id } });

    return this.issueTokens(session.userId, session.user.email);
  }

  async logout(token: string) {
    const session = await this.prisma.session.findUnique({
      where: { tokenHash: this.hashToken(token) },
    });

    if (session) {
      await this.prisma.session.delete({ where: { id: session.id } });
    }
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private async issueTokens(userId: string, email: string) {
    const payload: JwtPayload = { sub: userId, email };

    const accessToken = await this.jwt.signAsync(payload);
    const rawRefreshToken = randomBytes(32).toString('hex');

    await this.prisma.session.create({
      data: {
        tokenHash: this.hashToken(rawRefreshToken),
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken: rawRefreshToken };
  }
}
