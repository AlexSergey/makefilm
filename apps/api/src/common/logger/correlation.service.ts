import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LoggerConfig } from './config/logger-config.type';

@Injectable({ scope: Scope.REQUEST })
export class CorrelationIdService {
  private correlationId: string | string[];
  constructor(private readonly configService: ConfigService) {}

  getCorrelationId(): string | string[] {
    return this.correlationId;
  }

  getHeader(): string {
    return this.configService.getOrThrow<LoggerConfig['header']>('logger.header');
  }

  setCorrelationId(value: string | string[]): void {
    this.correlationId = value;
  }
}
