import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import * as process from 'node:process';

import validateConfig from '../../../utils/validate-config';
import { PasswordConfig } from './password-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  RESET_PASSWORD_REDIRECT: string;

  @IsString()
  RESET_PASSWORD_SECRET: string;
}

export default registerAs<PasswordConfig>('password', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    resetPasswordRedirect: process.env.RESET_PASSWORD_REDIRECT,
    resetPasswordSecret: process.env.RESET_PASSWORD_SECRET,
  };
});
