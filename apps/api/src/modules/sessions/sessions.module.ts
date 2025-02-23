import { SessionsEntity, UsersEntity } from '@makefilm/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionsController } from '../../api/sessions.controller';
import { GeolocationService } from '../geolocation/geolocation.service';
import { JwtService } from '../jwt/jwt.service';
import { UsersService } from '../users/users.service';
import { SessionsService } from './sessions.service';
import { SessionTaskService } from './sessions.task';

@Module({
  controllers: [SessionsController],
  imports: [TypeOrmModule.forFeature([SessionsEntity, UsersEntity])],
  providers: [SessionsService, JwtService, UsersService, GeolocationService, SessionTaskService],
})
export class SessionsModule {}
