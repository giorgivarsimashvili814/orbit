import { ConflictException, Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, WorkspaceRole } from 'generated/prisma/client';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreateWorkspaceDto,
  ): Promise<{ slug: string }> {
    try {
      const workspace = await this.prisma.workspace.create({
        data: {
          name: dto.name,
          slug: this.generateSlug(dto.name),
          members: {
            create: {
              userId,
              role: WorkspaceRole.OWNER,
            },
          },
        },
        select: { slug: true },
      });

      return workspace;
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Workspace slug already taken');
      }
      throw error;
    }
  }

  async findAll(userId: string): Promise<{ name: string; slug: string }[]> {
    return this.prisma.workspace.findMany({
      where: {
        members: { some: { userId } },
      },
      select: { name: true, slug: true },
    });
  }

  private generateSlug(name: string): string {
    const base = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const suffix = Math.random().toString(36).slice(2, 6);
    return `${base}-${suffix}`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} workspace`;
  // }

  // update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
  //   return `This action updates a #${id} workspace`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} workspace`;
  // }
}
