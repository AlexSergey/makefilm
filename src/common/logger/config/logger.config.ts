import { registerAs } from '@nestjs/config';
import { IsOptional, IsString } from 'class-validator';

import validateConfig from '../../../utils/validate-config';
import { LoggerConfig } from './logger-config.type';

class EnvironmentVariablesValidator {
  @IsOptional()
  @IsString()
  CORRELATION_ID_HEADER: string;

  @IsOptional()
  @IsString()
  LOG_LEVEL: string[];
}

export default registerAs<LoggerConfig>('logger', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);
  const logLevels = typeof process.env.LOG_LEVEL === 'string' ? process.env.LOG_LEVEL.split(' ') : false;

  return {
    header: process.env.CORRELATION_ID_HEADER || 'X-Correlation-ID',
    logLevel: logLevels || ['log'],
  };
});
