import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, WorkspaceRole } from 'generated/prisma/client';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreateWorkspaceDto,
  ): Promise<{ slug: string; teamKey: string }> {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const workspace = await tx.workspace.create({
          data: {
            name: dto.name,
            slug: dto.slug,
            members: {
              create: {
                userId,
                role: WorkspaceRole.OWNER,
              },
            },
            teams: {
              create: {
                name: dto.name,
                key: this.generateKey(dto.name),
              },
            },
          },
          select: {
            slug: true,
            members: { select: { id: true } },
            teams: {
              select: {
                id: true,
                key: true,
              },
            },
          },
        });

        const workspaceMemberId = workspace.members[0].id;
        const teamId = workspace.teams[0].id;
        const teamKey = workspace.teams[0].key;

        await tx.teamMember.create({
          data: { workspaceMemberId, teamId },
        });

        return {
          slug: workspace.slug,
          teamKey,
        };
      });

      return result;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('This workspace URL is already taken.');
      }
      throw error;
    }
  }

  async findAll(userId: string) {
    return await this.prisma.workspace.findMany({
      where: {
        members: { some: { userId } },
      },
      select: {
        name: true,
        slug: true,
        teams: {
          take: 1,
          select: {
            key: true,
          },
        },
      },
    });
  }

  async findOne(
    userId: string,
    slug: string,
  ): Promise<{ name: string; slug: string }> {
    const workspace = await this.prisma.workspace.findFirst({
      where: { slug: slug, members: { some: { userId } } },
      select: { name: true, slug: true },
    });

    if (!workspace) throw new NotFoundException('Workspace not found');

    return workspace;
  }

  async isSlugTaken(slug: string): Promise<boolean> {
    const workspace = await this.prisma.workspace.findUnique({
      where: { slug },
      select: { id: true },
    });
    return !!workspace;
  }

  private generateKey(name: string): string {
    return (
      name
        .trim()
        .toUpperCase()
        .replace(/[^A-Z]/g, '')
        .slice(0, 5) || 'TEAM'
    );
  }
}
