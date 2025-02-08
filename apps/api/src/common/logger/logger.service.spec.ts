import { ConfigService } from '@nestjs/config';
import { INQUIRER } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { CorrelationIdService } from './correlation.service';
import { LoggerService } from './logger.service';

class MockConfigService {
  getOrThrow(key: string): string {
    if (key === 'logger.logLevel') {
      return 'development';
    }

    return null;
  }
}

class MockCorrelationIdService {
  getCorrelationId(): string {
    return 'mock-correlation-id';
  }
}

describe('LoggerService', () => {
  let service: LoggerService;
  let correlationIdService: CorrelationIdService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        { provide: ConfigService, useClass: MockConfigService },
        { provide: CorrelationIdService, useClass: MockCorrelationIdService },
        { provide: INQUIRER, useValue: {} },
      ],
    }).compile();

    service = await module.resolve<LoggerService>(LoggerService);

    correlationIdService = module.get<CorrelationIdService>(CorrelationIdService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should format log message correctly', () => {
    const formattedMessage = service.formatMessage('log', 'Test message', 'pid123', 'log', 'TestContext', '50ms');
    expect(formattedMessage).toContain('Test message');
    expect(formattedMessage).toContain('[CorrelationID: mock-correlation-id]');
    expect(formattedMessage).toContain('pid123');
    expect(formattedMessage).toContain('TestContext');
  });

  it('should not add CorrelationID message if no correlationId is present', () => {
    jest.spyOn(correlationIdService, 'getCorrelationId').mockReturnValue(null);
    const formattedMessage = service.formatMessage('log', 'Test message', 'pid123', 'log', 'TestContext', '50ms');
    expect(formattedMessage).not.toContain('[CorrelationID: ');
  });

  it('should add CorrelationID message if correlationId is present', () => {
    const formattedMessage = service.formatMessage('log', 'Test message', 'pid123', 'log', 'TestContext', '50ms');
    expect(formattedMessage).toContain('[CorrelationID: mock-correlation-id]');
  });

  it('should call ConfigService and CorrelationIdService on initialization', () => {
    const configSpy = jest.spyOn(configService, 'getOrThrow');
    const correlationSpy = jest.spyOn(correlationIdService, 'getCorrelationId');

    const logger = new LoggerService({}, correlationIdService, configService);
    logger.formatMessage('log', 'Test message', 'pid123', 'log', 'TestContext', '50ms');
    expect(configSpy).toHaveBeenCalledWith('logger.logLevel');
    expect(correlationSpy).toHaveBeenCalled();
  });
});
