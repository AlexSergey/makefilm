import { CUSTOM_HEADER_AUTHORIZATION_SESSION } from '@makefilm/contracts';
import { StatusEnum } from '@makefilm/contracts';
import { UserRolesEnum } from '@makefilm/contracts';
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import httpContext from 'express-http-context';

import { LoggerService } from '../common/logger/logger.service';
import { JwtService } from '../modules/jwt/jwt.service';
import { JwtDecoded } from '../modules/jwt/jwt.types';
import { SessionsService } from '../modules/sessions/sessions.service';

@Injectable()
export class ProtectedRoute implements CanActivate {
  @Inject()
  private readonly logger: LoggerService;

  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly sessionService: SessionsService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const header = Object.keys(request.headers).find(
      (header) => header.toLowerCase() === CUSTOM_HEADER_AUTHORIZATION_SESSION.toLowerCase(),
    );

    if (!header) {
      this.logger.warn(`Header ${CUSTOM_HEADER_AUTHORIZATION_SESSION} is missing in the request`);

      return false;
    }

    const authorizationSession = request.headers[header];

    if (!authorizationSession) {
      this.logger.warn(`Header ${CUSTOM_HEADER_AUTHORIZATION_SESSION} is missing in the request`);

      return false;
    }

    const session = await this.sessionService.findSession(authorizationSession);

    if (!session) {
      this.logger.warn(`Authorization session ${authorizationSession} is not found`);

      return false;
    }

    const token = session.token;

    if (!token) {
      this.logger.warn(`Token for authorization session ${authorizationSession} is not found`);

      return false;
    }

    try {
      this.jwtService.decode<JwtDecoded>(token, this.configService.getOrThrow('jwt.secret'));
    } catch (e) {
      if (e instanceof Error) {
        this.logger.warn(`Token was expired. Session will be deleted`);
      }
      await this.sessionService.tokenWasExpired(authorizationSession);

      return false;
    }

    if (session.status === StatusEnum.NotActive) {
      this.logger.warn(`Session is not active`);

      return false;
    }

    if (session.user.role === UserRolesEnum.Admin) {
      this.logger.log(`User is admin, has access to the route`);

      httpContext.set('user_id', session.user.id);
      httpContext.set('session_id', session.id);
      httpContext.set('authProvider', session.authProvider);

      return true;
    }

    if (session.user.status === StatusEnum.NotActive) {
      this.logger.warn(`User is not active`);

      return false;
    }

    const roles = this.reflector.get<UserRolesEnum[]>('RoleMetadataKey', context.getHandler());

    if (!roles) {
      this.logger.log(`User has access to the route`);

      httpContext.set('user_id', session.user.id);
      httpContext.set('session_id', session.id);
      httpContext.set('authProvider', session.authProvider);

      return true;
    }

    if (!roles.some((role) => session.user.role === role)) {
      this.logger.warn(`The route protected by roles: ${JSON.stringify(roles)}. User has role ${session.user.role}`);

      return false;
    }
    this.logger.log(`User has access to the route`);

    httpContext.set('user_id', session.user.id);
    httpContext.set('session_id', session.id);
    httpContext.set('authProvider', session.authProvider);

    return true;
  }
}
