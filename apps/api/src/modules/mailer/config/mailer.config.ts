import { registerAs } from '@nestjs/config';
import { IsBoolean, IsString } from 'class-validator';
import * as process from 'node:process';

import validateConfig from '../../../utils/validate-config';
import { MailerConfig } from './mailer-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  MAILER_HOST: string;

  @IsString()
  MAILER_PASSWORD: string;

  @IsBoolean()
  MAILER_PREVIEW: boolean;

  @IsString()
  MAILER_USERNAME: string;
}

export default registerAs<MailerConfig>('mailer', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    host: process.env.MAILER_HOST,
    password: process.env.MAILER_PASSWORD,
    preview: !!process.env.MAILER_PREVIEW,
    username: process.env.MAILER_USERNAME,
  };
});
