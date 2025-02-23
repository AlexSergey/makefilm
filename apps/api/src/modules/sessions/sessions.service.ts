import { AuthProviderEnum, StatusEnum } from '@makefilm/contracts';
import { SessionsEntity, UsersEntity } from '@makefilm/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { GeolocationService } from '../geolocation/geolocation.service';
import { JwtService } from '../jwt/jwt.service';
import { SessionInfo } from './sessions.types';

@Injectable()
export class SessionsService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(SessionsEntity)
    private sessionRepository: Repository<SessionsEntity>,
    private readonly geolocationService: GeolocationService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async changeSessionStatus(session_id: string, status: StatusEnum) {
    return this.sessionRepository.save({
      id: session_id,
      status,
    });
  }

  async createSession(
    user: UsersEntity,
    ip: string,
    userAgent: string,
    authProvider: AuthProviderEnum,
    token?: string,
  ): Promise<SessionInfo> {
    const { lat, lng } = this.geolocationService.getLatLngFromIp(ip);
    const sessionsEntity = new SessionsEntity();
    sessionsEntity.user = user;
    sessionsEntity.userAgent = userAgent;
    sessionsEntity.lat = lat;
    sessionsEntity.lng = lng;
    sessionsEntity.ip = ip;
    if (token) {
      sessionsEntity.token = token;
    } else {
      sessionsEntity.token = this.jwtService.createAuthToken(user);
    }
    sessionsEntity.authProvider = authProvider;
    const session = await this.sessionRepository.save(sessionsEntity);

    return { session_id: session.id };
  }

  async deleteAllSessions(user_id: string): Promise<DeleteResult> {
    const session = await this.sessionRepository.find({ relations: ['user'], where: { user: { id: user_id } } });

    return this.sessionRepository.delete(session.map((session) => session.id));
  }

  async deleteSessionById(session_id: string): Promise<DeleteResult> {
    return this.sessionRepository.delete({ id: session_id });
  }

  async findSession(session_id: string | undefined): Promise<null | SessionsEntity> {
    if (!session_id) {
      return null;
    }

    return this.sessionRepository.findOne({ relations: ['user'], where: { id: session_id } });
  }

  async getAllSessions(user_id: string | undefined): Promise<SessionsEntity[]> {
    if (!user_id) {
      return null;
    }

    return this.sessionRepository.find({ relations: ['user'], where: { user: { id: user_id } } });
  }

  async removeExpiredSessions(): Promise<void> {
    const sessions = await this.sessionRepository.find();
    for (const session of sessions) {
      if (session.status === StatusEnum.NotActive) {
        await this.tokenWasExpired(session.id);
      } else {
        try {
          this.jwtService.decodeAuthToken(session.token);
        } catch (e) {
          if (e instanceof Error) {
            // eslint-disable-next-line no-console
            console.log(e);
          }
          await this.tokenWasExpired(session.id);
        }
      }
    }
  }

  async tokenWasExpired(session_id: string): Promise<DeleteResult> {
    return this.deleteSessionById(session_id);
  }

  async updateSession(
    user: UsersEntity,
    session_id: string,
    ip: string,
    userAgent: string,
    authProvider: AuthProviderEnum,
    token?: string,
  ): Promise<null | SessionInfo> {
    const { lat, lng } = this.geolocationService.getLatLngFromIp(ip);
    const newToken = typeof token === 'string' ? token : this.jwtService.createAuthToken(user);

    const session = await this.sessionRepository.update(session_id, {
      authProvider,
      ip,
      lat,
      lng,
      token: newToken,
      userAgent,
    });

    if (!session) {
      return null;
    }

    return { session_id };
  }
}
