import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from 'src/auth/types';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateWorkspaceDto,
  ) {
    return this.workspaceService.create(user.userId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.workspaceService.findAll(user.userId);
  }

  @Get(':slug')
  @UseGuards(JwtAuthGuard)
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('slug') slug: string) {
    return this.workspaceService.findOne(user.userId, slug);
  }
}
