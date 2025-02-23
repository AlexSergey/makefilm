import { SessionsEntity, UsersEntity } from '@makefilm/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from '../../api/auth.controller';
import { GeolocationService } from '../geolocation/geolocation.service';
import { JwtService } from '../jwt/jwt.service';
import { SessionsService } from '../sessions/sessions.service';
import { UsersService } from '../users/users.service';
import { GoogleAuthService } from './social/google-auth.service';
import { LocalAuthService } from './social/local-auth.service';

@Module({
  controllers: [AuthController],
  imports: [TypeOrmModule.forFeature([UsersEntity, SessionsEntity])],
  providers: [UsersService, SessionsService, JwtService, GoogleAuthService, LocalAuthService, GeolocationService],
})
export class AuthModule {}
