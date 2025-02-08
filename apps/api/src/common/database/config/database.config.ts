import { registerAs } from '@nestjs/config';
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min, ValidateIf } from 'class-validator';

import validateConfig from '../../../utils/validate-config';
import { DatabaseConfig } from './database-config.type';

class EnvironmentVariablesValidator {
  @IsOptional()
  @IsString()
  DATABASE_CA: string;

  @IsOptional()
  @IsString()
  DATABASE_CERT: string;

  @IsString()
  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  DATABASE_HOST: string;

  @IsOptional()
  @IsString()
  DATABASE_KEY: string;

  @IsBoolean()
  @IsOptional()
  DATABASE_LOGGING: boolean;

  @IsInt()
  @IsOptional()
  DATABASE_MAX_CONNECTIONS: number;

  @IsString()
  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  DATABASE_NAME: string;

  @IsString()
  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  DATABASE_PASSWORD: string;

  @IsInt()
  @Max(65535)
  @Min(0)
  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  DATABASE_PORT: number;

  @IsBoolean()
  @IsOptional()
  DATABASE_REJECT_UNAUTHORIZED: boolean;

  @IsBoolean()
  @IsOptional()
  DATABASE_SHOW_LOGS: boolean;

  @IsBoolean()
  @IsOptional()
  DATABASE_SSL_ENABLED: boolean;

  @IsBoolean()
  @IsOptional()
  DATABASE_SYNCHRONIZE: boolean;

  @IsString()
  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  DATABASE_TYPE: string;

  @IsString()
  @ValidateIf((envValues) => envValues.DATABASE_URL)
  DATABASE_URL: string;

  @IsString()
  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  DATABASE_USERNAME: string;
}

export default registerAs<DatabaseConfig>('database', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    ca: process.env.DATABASE_CA,
    cert: process.env.DATABASE_CERT,
    host: process.env.DATABASE_HOST,
    key: process.env.DATABASE_KEY,
    logging: process.env.DATABASE_LOGGING !== 'false',
    maxConnections: process.env.DATABASE_MAX_CONNECTIONS ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10) : 100,
    name: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
    rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
    showLogs: process.env.DATABASE_SHOW_LOGS === 'true',
    sslEnabled: process.env.DATABASE_SSL_ENABLED === 'true',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    type: process.env.DATABASE_TYPE,
    url: process.env.DATABASE_URL,
    username: process.env.DATABASE_USERNAME,
  };
});
