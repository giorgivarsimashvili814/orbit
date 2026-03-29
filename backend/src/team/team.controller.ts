import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from 'src/auth/types';

@UseGuards(JwtAuthGuard)
@Controller(':workspaceSlug/teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Param('workspaceSlug') workspaceSlug: string,
    @Body() dto: CreateTeamDto,
  ) {
    return this.teamService.create(user.userId, workspaceSlug, dto);
  }

  @Get()
  findAll(
    @CurrentUser() user: AuthenticatedUser,

    @Param('workspaceSlug') workspaceSlug: string,
  ) {
    return this.teamService.findAll(user.userId, workspaceSlug);
  }
}
