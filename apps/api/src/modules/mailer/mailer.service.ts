import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  constructor(
    private readonly mailerService: NestMailerService,
    private readonly configService: ConfigService,
  ) {}

  async emailConfirmation(email: string, confirmationLink: string): Promise<void> {
    await this.mailerService.sendMail({
      context: {
        confirmationLink,
        name: this.configService.getOrThrow('app.name'),
        url: this.configService.getOrThrow('app.frontendUrl'),
      },
      from: 'noreply@nestjs.com',
      subject: 'Email confirmation',
      template: 'user-confirmation',
      to: email,
    });
  }

  async resetPassword(email: string, resetPasswordLink: string): Promise<void> {
    await this.mailerService.sendMail({
      context: {
        name: this.configService.getOrThrow('app.name'),
        resetPasswordLink,
      },
      from: 'noreply@nestjs.com',
      subject: 'Reset Password',
      template: 'reset-password',
      to: email,
    });
  }
}
