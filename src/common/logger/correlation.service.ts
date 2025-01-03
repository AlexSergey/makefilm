import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.REQUEST })
export class CorrelationIdService {
  private correlationId: string | string[];
  constructor(private readonly configService: ConfigService) {}

  getCorrelationId(): string | string[] {
    return this.correlationId;
  }

  getHeader(): string {
    return this.configService.getOrThrow('logger.header');
  }

  setCorrelationId(value: string | string[]): void {
    this.correlationId = value;
  }
}
