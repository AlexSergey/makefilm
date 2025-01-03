import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 } from 'uuid';

import { CorrelationIdService } from './correlation.service';
import { LoggerService } from './logger.service';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(
    private logger: LoggerService,
    private correlationIdService: CorrelationIdService,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const headerName = this.correlationIdService.getHeader();
    if (!headerName) {
      return next();
    }

    // If the correlationId has not yet been saved then I save it
    let currentCorrelationId = this.correlationIdService.getCorrelationId();
    if (!currentCorrelationId) {
      // If present among the headers I take it from there otherwise I generate a new one
      const correlationId = req?.header(headerName);
      if (correlationId) {
        this.logger.debug(`CorrelationId header found: ${correlationId}`);
        this.correlationIdService.setCorrelationId(correlationId);
      }
      // Generate a new correlationId if it is not already present among the headers
      else {
        this.logger.debug('CorrelationId header not found. Generating new one.');
        const uuid = v4();
        this.correlationIdService.setCorrelationId(uuid);
      }
    }

    // Add the correlationId to each request and to the response if it is not present
    currentCorrelationId = this.correlationIdService.getCorrelationId();

    if (!req?.headers[headerName]) {
      this.logger.debug('Appending correlationId to request headers.');
      req.headers[headerName] = currentCorrelationId;
    }
    if (!res.getHeaderNames().includes(headerName)) {
      this.logger.debug('Appending correlationId to response headers.');
      res.setHeader(headerName, currentCorrelationId);
    }

    return next();
  }
}
