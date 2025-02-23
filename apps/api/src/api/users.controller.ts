import type { Response } from 'express';

import { AuthProviderEnum, UserRolesEnum } from '@makefilm/contracts';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  Post,
  Put,
  Req,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ApiResponse } from '@nestjs/swagger';

import { FilterParams } from '../common/database/decorators/filter.decorator';
import { Pagination, PaginationParams } from '../common/database/decorators/pagination.decorator';
import { SearchParams } from '../common/database/decorators/search.decorator';
import { Sorting, SortParams } from '../common/database/decorators/sort.decorator';
import { USERS_URL } from '../constants/url';
import { Roles } from '../decorators/role.decorator';
import { ProtectedRoute } from '../guards/protected-route.guard';
import { JwtService } from '../modules/jwt/jwt.service';
import { MailerService } from '../modules/mailer/mailer.service';
import { UserSerializer } from '../modules/serializers/user.serializer';
import { SessionsService } from '../modules/sessions/sessions.service';
import { UserCreateReqDto, UserResDto, UserUpdateDto } from '../modules/users/user.dto';
import { FilterUser } from '../modules/users/user.types';
import { UsersService } from '../modules/users/users.service';

@Controller(USERS_URL)
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly sessionService: SessionsService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly httpAdapterHost: HttpAdapterHost<ExpressAdapter>,
  ) {}

  @ApiResponse({
    description: 'The user records',
    status: 201,
    type: UserResDto,
  })
  @Post()
  async createUser(
    @Body() { email, password, username }: UserCreateReqDto,
    @Ip() ip: string,
    @Req() req: Request,
  ): Promise<UserResDto> {
    const user = await this.userService.createUser({
      email,
      password,
      username,
    });
    const userAgent = req.headers['user-agent'];
    const { session_id } = await this.sessionService.createSession(user, ip, userAgent, AuthProviderEnum.Local);

    if (user.role === UserRolesEnum.NotConfirmed) {
      const url = this.userService.userConfirmationUrl(user);
      await this.mailerService.emailConfirmation(email, url);
    }

    return {
      role: user.role,
      session_id: session_id,
      status: user.status,
      user_id: user.id,
      username: user.username,
    };
  }

  @ApiResponse({
    description: 'The user update method',
    status: 200,
  })
  @Delete(':id')
  @UseGuards(ProtectedRoute)
  @Roles(UserRolesEnum.Admin)
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    await this.userService.deleteUser(id);

    return {
      message: 'ok',
    };
  }

  @Get(':id')
  @UseGuards(ProtectedRoute)
  @UseInterceptors(ClassSerializerInterceptor)
  async getUser(@Param('id') id: string): Promise<UserSerializer> {
    const user = await this.userService.findById(id);

    return new UserSerializer(user);
  }

  @Get()
  @UseGuards(ProtectedRoute)
  @Roles(UserRolesEnum.Admin, UserRolesEnum.Moderator)
  @UseInterceptors(ClassSerializerInterceptor)
  async getUsers(
    @PaginationParams() pagination: Pagination,
    @SortParams() sort: Sorting,
    @FilterParams() filter: FilterUser | null,
    @SearchParams() search: null | string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserSerializer[]> {
    const [users, total] = await this.userService.getUsers(pagination, sort, filter, search);
    const { httpAdapter } = this.httpAdapterHost;
    httpAdapter.setHeader(res, 'Content-Range', `0-10/${total}`);

    return users.map((user) => new UserSerializer(user));
  }

  @ApiResponse({
    description: 'The user update method',
    status: 200,
  })
  @Put(':id')
  @UseGuards(ProtectedRoute)
  @Roles(UserRolesEnum.Admin, UserRolesEnum.Moderator)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateUser(
    @Param('id') id: string,
    @Body() { role, status, username }: UserUpdateDto,
  ): Promise<{ message: string }> {
    await this.userService.updateUser(id, { role, status, username });

    return {
      message: 'ok',
    };
  }
}
