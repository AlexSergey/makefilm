import { Body, Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';

import { PASSWORD_URL } from '../constants/url';
import { JwtService } from '../modules/jwt/jwt.service';
import { JwtDecoded } from '../modules/jwt/jwt.types';
import { MailerService } from '../modules/mailer/mailer.service';
import { PasswordService } from '../modules/password/password.service';

@Controller(PASSWORD_URL)
export class PasswordController {
  constructor(
    private readonly userService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  @Post('reset-password')
  async resetPassword(@Body('token') token: string, @Body('password') password: string): Promise<void> {
    const { user } = this.jwtService.decode<JwtDecoded>(
      token,
      this.configService.getOrThrow('password.resetPasswordSecret'),
    );
    const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));
    await this.userService.updateUser(user.user_id, { password: hashedPassword });
  }

  @Post('reset-password-message')
  async resetPasswordMessage(@Body('email') email: string): Promise<void> {
    const user = await this.userService.resetPasswordRequest(email);
    const resetPasswordToken = this.jwtService.createToken(
      user,
      this.configService.getOrThrow('password.resetPasswordSecret'),
      '30d',
    );
    const url = [this.configService.getOrThrow('password.resetPasswordRedirect'), '?token=', resetPasswordToken].join(
      '',
    );
    await this.mailerService.resetPassword(email, url);
  }
}
