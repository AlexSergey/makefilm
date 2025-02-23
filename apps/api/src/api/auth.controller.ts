import { AuthProviderEnum } from '@makefilm/contracts';
import { CUSTOM_HEADER_AUTHORIZATION_SESSION, StatusEnum, UserRolesEnum } from '@makefilm/contracts';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  HttpStatus,
  Inject,
  Ip,
  Post,
  Query,
  Redirect,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import httpContext from 'express-http-context';

import { LoggerService } from '../common/logger/logger.service';
import { AUTH_URL } from '../constants/url';
import { Roles } from '../decorators/role.decorator';
import { ProtectedRoute } from '../guards/protected-route.guard';
import { SignInGoogleReqDto, SignInReqDto, SignOutResDto } from '../modules/auth/auth.dto';
import { GoogleAuthService } from '../modules/auth/social/google-auth.service';
import { LocalAuthService } from '../modules/auth/social/local-auth.service';
import { JwtService } from '../modules/jwt/jwt.service';
import { SessionsService } from '../modules/sessions/sessions.service';
import { UserResDto } from '../modules/users/user.dto';
import { UsersService } from '../modules/users/users.service';

@Controller(AUTH_URL)
export class AuthController {
  @Inject()
  private readonly logger: LoggerService;

  constructor(
    private readonly userService: UsersService,
    private readonly sessionService: SessionsService,
    private readonly jwtService: JwtService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly localAuthService: LocalAuthService,
  ) {}

  @ApiOperation({
    description: 'This endpoint is responsible for confirm user email',
    summary: 'Confirm user email',
  })
  @ApiResponse({ description: 'Bad Request', status: HttpStatus.BAD_REQUEST })
  @ApiQuery({ example: 'xxxx', name: 'token' })
  @Redirect(process.env.FRONTEND_REDIRECT)
  @Get('confirmation')
  async confirmation(@Query('token') token: string): Promise<void> {
    const { user } = this.jwtService.decodeConfirmationToken(token);
    await this.userService.userConfirmation(user.user_id);

    this.logger.log('User successfully confirmed');
  }

  @ApiOperation({
    description: 'This endpoint is responsible for authorization user by google',
    summary: 'Auth user by Google provider',
  })
  @ApiResponse({ description: 'User is not active', status: HttpStatus.CONFLICT })
  @ApiResponse({
    description: 'User Successful authorized by Google provider',
    status: 200,
    type: UserResDto,
  })
  @Post('google/sign-in')
  async googleAuth(@Ip() ip: string, @Req() req: Request, @Body() { credential }: SignInGoogleReqDto) {
    this.logger.log('User is signing in by google');

    const tokenInfo = await this.googleAuthService.signIn(credential);
    const { email, name } = tokenInfo.getPayload();
    const username = name;
    let user = await this.userService.findByEmail(email);

    if (!user) {
      this.logger.log('User is not found will be created');

      user = await this.userService.createUser({
        confirmed: true,
        email,
        username,
      });
    }
    if (user.status === StatusEnum.NotActive) {
      this.logger.error(`User ${user.id} is not active`);

      throw new ConflictException('User currently is not active. Please contact administrator to solve the problem');
    }

    const userAgent = req.headers['user-agent'];
    const { session_id } = await this.sessionService.createSession(user, ip, userAgent, AuthProviderEnum.Google);

    return {
      role: user.role,
      session_id: session_id,
      status: user.status,
      user_id: user.id,
      username: user.username,
    };
  }

  @ApiOperation({
    description: 'This endpoint is responsible for authorization user by email and password',
    summary: 'Auth user by email and password',
  })
  @ApiResponse({ description: 'User is not active', status: HttpStatus.CONFLICT })
  @ApiResponse({
    description: 'User Successful authorized by Google provider',
    status: 200,
    type: UserResDto,
  })
  @Post('local/sign-in')
  async signIn(
    @Body() { email, password }: SignInReqDto,
    @Headers(CUSTOM_HEADER_AUTHORIZATION_SESSION) authorizationSession: string,
    @Ip() ip: string,
    @Req() req: Request,
  ): Promise<UserResDto> {
    const existedSession = await this.sessionService.findSession(authorizationSession);
    if (!password) {
      throw new BadRequestException('User or password is not correct');
    }
    const user = await this.localAuthService.signIn({
      email,
      password,
    });
    if (user.status === StatusEnum.NotActive) {
      this.logger.error(`User ${user.id} is not active`);

      throw new ConflictException('User currently is not active. Please contact administrator to solve the problem');
    }
    const userAgent = req.headers['user-agent'];
    const { session_id } = existedSession
      ? await this.sessionService.updateSession(user, authorizationSession, ip, userAgent, AuthProviderEnum.Local)
      : await this.sessionService.createSession(user, ip, userAgent, AuthProviderEnum.Local);

    return {
      role: user.role,
      session_id: session_id,
      status: user.status,
      user_id: user.id,
      username: user.username,
    };
  }

  @ApiOperation({
    description: 'This endpoint is responsible for sign out user',
    summary: 'User sign out',
  })
  @ApiResponse({
    description: 'All session were deleted',
    status: 200,
    type: SignOutResDto,
  })
  @Get('sign-out')
  @UseGuards(ProtectedRoute)
  async signout(): Promise<SignOutResDto> {
    const user_id = httpContext.get('user_id');
    await this.sessionService.deleteAllSessions(user_id);

    return {
      status: 'ok',
    };
  }

  @ApiResponse({
    description: 'User is verified',
    status: 200,
    type: UserResDto,
  })
  @ApiResponse({ description: 'User not found', status: HttpStatus.FORBIDDEN })
  @Get('verify')
  @UseGuards(ProtectedRoute)
  @Roles(UserRolesEnum.User, UserRolesEnum.NotConfirmed, UserRolesEnum.Admin, UserRolesEnum.Moderator)
  async verify(
    @Headers(CUSTOM_HEADER_AUTHORIZATION_SESSION) session_id: string,
    @Ip() ip: string,
    @Req() req: Request,
    @Body('token') token?: string,
  ): Promise<UserResDto> {
    const user_id = httpContext.get('user_id');
    const authProvider = httpContext.get('authProvider');
    const newAuthProvider =
      typeof authProvider === 'string' ? (authProvider as AuthProviderEnum) : AuthProviderEnum.Local;
    const user = await this.userService.findById(user_id);

    if (!user) {
      this.logger.error(`User ${user.id} not found`);

      throw new ForbiddenException('User not found');
    }

    const newToken = typeof token === 'string' ? token : this.jwtService.createAuthToken(user);
    const userAgent = req.headers['user-agent'];
    await this.sessionService.updateSession(user, session_id, ip, userAgent, newAuthProvider, newToken);

    return {
      role: user.role,
      session_id: session_id,
      status: user.status,
      user_id: user.id,
      username: user.username,
    };
  }
}
