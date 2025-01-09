import { Injectable } from '@nestjs/common';

import { LoggerService } from '../logger/logger.service';

@Injectable()
export class MetricsService {
  constructor(private readonly logger: LoggerService) {}

  errorApplication(): void {
    this.logger.error('Error Application');
  }

  errorDatabase(): void {
    this.logger.error('Error Database');
  }

  errorUnknown(): void {
    this.logger.error('Error Unknown');
  }
}
