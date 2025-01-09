import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigurableModuleClass } from '@nestjs/common/cache/cache.module-definition';

import { CorrelationIdMiddleware } from './correlation.middleware';
import { CorrelationIdService } from './correlation.service';
import { LoggerService } from './logger.service';

@Global()
@Module({
  exports: [CorrelationIdService, LoggerService],
  providers: [CorrelationIdService, LoggerService],
})
export class LoggerModule extends ConfigurableModuleClass {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
