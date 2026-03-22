import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [AuthModule, PrismaModule, WorkspaceModule],
})
export class AppModule {}
