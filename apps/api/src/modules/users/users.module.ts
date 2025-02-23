import { SessionsEntity, UsersEntity } from '@makefilm/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from '../../api/users.controller';
import { GeolocationService } from '../geolocation/geolocation.service';
import { JwtService } from '../jwt/jwt.service';
import { MailerService } from '../mailer/mailer.service';
import { SessionsService } from '../sessions/sessions.service';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([UsersEntity, SessionsEntity])],
  providers: [UsersService, SessionsService, JwtService, MailerService, GeolocationService],
})
export class UsersModule {}
