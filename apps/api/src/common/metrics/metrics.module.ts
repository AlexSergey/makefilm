import { Module } from '@nestjs/common';

import { MetricsService } from './metrics.service';

@Module({
  exports: [MetricsService],
  providers: [MetricsService],
})
export class MetricsModule {}
