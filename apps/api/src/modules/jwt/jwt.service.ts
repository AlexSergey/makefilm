import { UsersEntity } from '@makefilm/entities';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';

import { UserForToken } from '../users/user.types';
import { JwtDecoded } from './jwt.types';

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}

  createAuthToken(user: UsersEntity): string {
    return this.createToken(
      user,
      this.configService.getOrThrow('jwt.secret'),
      this.configService.getOrThrow('jwt.authTokenExpiresIn'),
    );
  }

  createToken(user: UsersEntity, secret: string, expiresIn: string): string {
    const userForToken: UserForToken = {
      email: user.email,
      role: user.role,
      status: user.status,
      user_id: user.id,
    };

    return jwt.sign({ user: userForToken }, secret, {
      expiresIn,
    });
  }

  decode<T>(token: string, secret: string): T {
    return jwt.verify(token, secret) as T;
  }

  decodeAuthToken(token: string): JwtDecoded {
    return this.decode<JwtDecoded>(token, this.configService.getOrThrow('jwt.secret'));
  }

  decodeConfirmationToken(token: string): JwtDecoded {
    return this.decode<JwtDecoded>(token, this.configService.getOrThrow('jwt.confirmationSecret'));
  }
}
