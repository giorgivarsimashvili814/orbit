import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, workspaceSlug: string, dto: CreateTeamDto) {
    const workspaceMember = await this.getWorkspaceMember(
      userId,
      workspaceSlug,
    );

    try {
      return await this.prisma.$transaction(async (tx) => {
        const team = await tx.team.create({
          data: {
            name: dto.name,
            key: dto.key,
            workspaceId: workspaceMember.workspaceId,
            members: {
              create: { workspaceMemberId: workspaceMember.id },
            },
          },
          select: { key: true },
        });

        return team;
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = error.meta?.target as string[];
        if (target?.includes('key')) {
          throw new ConflictException(
            `Team key "${dto.key}" already exists in this workspace`,
          );
        }
        throw new ConflictException(
          `Team name "${dto.name}" already exists in this workspace`,
        );
      }
      throw error;
    }
  }

  async findAll(userId: string, workspaceSlug: string) {
    const workspaceMember = await this.getWorkspaceMember(
      userId,
      workspaceSlug,
    );

    return this.prisma.team.findMany({
      where: { workspaceId: workspaceMember.workspaceId },
      select: { id: true, name: true, key: true },
    });
  }

  private async getWorkspaceMember(userId: string, workspaceSlug: string) {
    const workspaceMember = await this.prisma.workspaceMember.findFirst({
      where: { userId, workspace: { slug: workspaceSlug } },
      select: { id: true, workspaceId: true },
    });

    if (!workspaceMember) throw new ForbiddenException('Access denied');
    return workspaceMember;
  }
}
