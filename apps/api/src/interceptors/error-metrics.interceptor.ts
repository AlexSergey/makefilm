import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TypeORMError } from 'typeorm';

import { MetricType } from '../common/metrics/metrics.interface';
import { MetricsService } from '../common/metrics/metrics.service';
import { AppConfig } from '../config/app-config.type';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class ErrorMetricsInterceptor implements NestInterceptor {
  constructor(
    private readonly metricService: MetricsService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        const request: Request = context.switchToHttp().getRequest();
        if (err instanceof TypeORMError) {
          this.updateMetrics(MetricType.DATABASE);
        } else if (err instanceof HttpException) {
          this.updateMetrics(MetricType.APPLICATION);
        } else {
          this.updateMetrics(MetricType.UNKNOWN);
        }
        const env = this.configService.getOrThrow<AppConfig>('app')?.nodeEnv;

        if (env === 'development') {
          // eslint-disable-next-line no-console
          console.error(err);
        }

        return throwError(
          () =>
            new HttpException(
              {
                message: err?.message || err?.detail || 'Something went wrong',
                method: request.method,
                route: request.path,
                timestamp: new Date().toISOString(),
              },
              err.status || err.statusCode || 500,
            ),
        );
      }),
    );
  }

  async updateMetrics(type: MetricType): Promise<void> {
    switch (type) {
      case MetricType.APPLICATION:
        this.metricService.errorApplication();
        break;
      case MetricType.DATABASE:
        this.metricService.errorDatabase();
        break;
      default:
        this.metricService.errorUnknown();
    }
  }
}
