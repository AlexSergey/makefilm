import { registerAs } from '@nestjs/config';
import { IsEnum, IsInt, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';

import validateConfig from '.././utils/validate-config';
import { AppConfig } from './app-config.type';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariablesValidator {
  @IsOptional()
  @IsString()
  ADMIN_EMAIL: string;

  @IsOptional()
  @IsString()
  API_PREFIX: string;

  @IsOptional()
  @IsString()
  APP_FALLBACK_LANGUAGE: string;

  @IsOptional()
  @IsString()
  APP_HEADER_LANGUAGE: string;

  @IsInt()
  @IsOptional()
  @Max(65535)
  @Min(0)
  APP_PORT: number;

  @IsString()
  APP_URL: string;

  @IsOptional()
  // eslint-disable-next-line camelcase
  @IsUrl({ require_tld: false })
  BACKEND_DOMAIN: string;

  @IsOptional()
  // eslint-disable-next-line camelcase
  @IsUrl({ require_tld: false })
  FRONTEND_DOMAIN: string;

  @IsOptional()
  // eslint-disable-next-line camelcase
  @IsUrl({ require_tld: false })
  FRONTEND_REDIRECT: string;

  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    adminEmail: process.env.ADMIN_EMAIL,
    apiPrefix: process.env.API_PREFIX || 'api',
    appUrl: process.env.APP_URL || 'http://localhost:3005',
    backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost',
    fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
    frontendDomain: process.env.FRONTEND_DOMAIN,
    frontendUrl: process.env.FRONTEND_REDIRECT || 'http://localhost:3000',
    headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
    name: process.env.APP_NAME || 'app',
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.APP_PORT
      ? parseInt(process.env.APP_PORT, 10)
      : process.env.PORT
        ? parseInt(process.env.PORT, 10)
        : 3000,
    workingDirectory: process.env.PWD || process.cwd(),
  };
});
