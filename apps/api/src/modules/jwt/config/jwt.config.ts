import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import * as process from 'node:process';

import validateConfig from '../../../utils/validate-config';
import { JwtConfig } from './jwt-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  AUTH_TOKEN_EXPIRES_IN: string;

  @IsString()
  AUTH_TOKEN_SECRET: string;

  @IsString()
  CONFIRMATION_SECRET: string;
}

export default registerAs<JwtConfig>('jwt', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    authTokenExpiresIn: process.env.AUTH_TOKEN_EXPIRES_IN || '1d',
    confirmationSecret: process.env.CONFIRMATION_SECRET,
    secret: process.env.AUTH_TOKEN_SECRET,
  };
});
