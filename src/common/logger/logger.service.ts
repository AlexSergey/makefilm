import { LoggerService as BaseLoggerService, ConsoleLogger, Inject, Injectable, LogLevel, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { INQUIRER } from '@nestjs/core';

import { CorrelationIdService } from './correlation.service';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger implements BaseLoggerService {
  constructor(
    @Inject(INQUIRER) parentClass: object,
    private correlationIdService: CorrelationIdService,
    private readonly configService: ConfigService,
  ) {
    super(parentClass?.constructor?.name);
    const logLevel = this.configService.getOrThrow('logger.logLevel');

    this.setLogLevels(logLevel ? logLevel : ['log', 'fatal', 'error', 'warn', 'debug', 'verbose']);
  }

  override formatMessage(
    logLevel: LogLevel,
    message: unknown,
    pidMessage: string,
    formattedLogLevel: string,
    contextMessage: string,
    timestampDiff: string,
  ): string {
    const output = this.stringifyMessage(message, logLevel);
    pidMessage = this.colorize(pidMessage, logLevel);
    formattedLogLevel = this.colorize(formattedLogLevel, logLevel);
    let prefix = '';

    if (logLevel === 'log') {
      prefix = 'ℹ️ ';
    }

    if (logLevel === 'fatal') {
      prefix = '💀️ ';
    }

    if (logLevel === 'error') {
      prefix = '❌ ';
    }

    if (logLevel === 'warn') {
      prefix = '⚠️ ';
    }

    if (logLevel === 'debug') {
      prefix = '🐞 ';
    }

    return `${prefix}${pidMessage}${this.getTimestamp()} ${formattedLogLevel} ${contextMessage}${this.getCorrelationIdMessage()}${output}${timestampDiff}\n`;
  }

  private getCorrelationIdMessage(): string {
    let message = '';
    const correlationId = this.correlationIdService?.getCorrelationId();
    if (correlationId) {
      message += `\x1b[90m[CorrelationID: ${correlationId}]\x1b[0m `;
    }

    return message;
  }
}
