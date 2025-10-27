import { RouteAccess } from '@douglasneuroinformatics/libnest';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import type { Session } from '@prisma/client';

import { CreateSessionDto } from './dto/create-session.dto';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @ApiOperation({ description: 'Create Session' })
  @Post()
  @RouteAccess({ action: 'create', subject: 'Session' })
  create(@Body() data: CreateSessionDto): Promise<Session> {
    return this.sessionsService.create(data);
  }

  @ApiOperation({ description: 'Find Session by ID' })
  @Get()
  @RouteAccess({ action: 'read', subject: 'Session' })
  findByID(id: string): Promise<Session> {
    return this.sessionsService.findById(id);
  }

  @ApiOperation({ description: 'Find Session by ID' })
  @Post('list')
  @RouteAccess({ action: 'read', subject: 'Session' })
  findSessionList(@Query('ids') ids: string[]): Promise<Session[]> {
    const idArray = Array.isArray(ids) ? ids : (ids as string).split(',');
    return this.sessionsService.findSessionList(idArray);
  }
}
