import { Module } from '@nestjs/common';

import { PasswordController } from '../../api/password.controller';
import { JwtService } from '../jwt/jwt.service';
import { MailerService } from '../mailer/mailer.service';
import { PasswordService } from './password.service';

@Module({
  controllers: [PasswordController],
  imports: [],
  providers: [PasswordService, JwtService, MailerService],
})
export class PasswordModule {}
