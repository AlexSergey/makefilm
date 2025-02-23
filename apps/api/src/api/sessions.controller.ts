import { StatusEnum } from '@makefilm/contracts';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import httpContext from 'express-http-context';

import { SESSIONS_URL } from '../constants/url';
import { ProtectedRoute } from '../guards/protected-route.guard';
import { SessionSerializer } from '../modules/serializers/session.serializer';
import { SessionsService } from '../modules/sessions/sessions.service';
import { UserResDto } from '../modules/users/user.dto';

@Controller(SESSIONS_URL)
export class SessionsController {
  constructor(private readonly sessionService: SessionsService) {}

  @ApiResponse({
    description: 'The user records',
    status: 200,
    type: UserResDto,
  })
  @UseGuards(ProtectedRoute)
  @Post('change-status')
  async changeStatus(
    @Body('status') status: StatusEnum,
    @Body('session_id') session_id: string,
  ): Promise<{ status: string }> {
    await this.sessionService.changeSessionStatus(session_id, status);

    return {
      status: 'ok',
    };
  }

  @ApiResponse({
    description: 'The user records',
    status: 200,
    type: UserResDto,
  })
  @UseGuards(ProtectedRoute)
  @Delete('delete-session')
  async deleteSession(@Body('session_id') session_id: string): Promise<{ status: string }> {
    await this.sessionService.deleteSessionById(session_id);

    return {
      status: 'ok',
    };
  }

  @ApiResponse({
    description: 'The user records',
    status: 200,
    type: UserResDto,
  })
  @UseGuards(ProtectedRoute)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('all')
  async getSessions(): Promise<SessionSerializer[]> {
    const user_id = httpContext.get('user_id');

    const sessions = await this.sessionService.getAllSessions(user_id);

    return sessions.map((session) => new SessionSerializer(session));
  }
}
