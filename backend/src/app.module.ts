import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { TeamModule } from './team/team.module';

@Module({
  imports: [AuthModule, PrismaModule, WorkspaceModule, TeamModule],
})
export class AppModule {}
