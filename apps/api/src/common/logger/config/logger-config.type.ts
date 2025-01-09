import { LogLevel } from '@nestjs/common';

export interface LoggerConfig {
  header: string;
  logLevel: LogLevel[];
}
