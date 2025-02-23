import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MailerService } from './mailer.service';

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config) => {
        return {
          defaults: {
            from: '"nest-modules" <modules@nestjs.com>',
          },
          preview: config.getOrThrow('mailer.preview'),
          template: {
            adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
            dir: process.cwd() + '/assets/templates/',
            options: {
              strict: true,
            },
          },
          transport: {
            auth: {
              pass: config.getOrThrow('mailer.password'),
              user: config.getOrThrow('mailer.username'),
            },
            host: config.getOrThrow('mailer.host'),
            port: 587,
            secure: false, // upgrade later with STARTTLS
          },
        };
      },
    }),
  ],
  providers: [MailerService],
})
export class MailerModule {}
