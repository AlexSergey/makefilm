import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { checkStatus } from '../utils/error-checker';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (exceptionResponse as any).message || exception.message;

      if (Array.isArray(message)) {
        message = message[0];
      }
    }

    response.status(status).json({
      data: null,
      message,
      status,
      success: checkStatus(status),
    });
  }
}
