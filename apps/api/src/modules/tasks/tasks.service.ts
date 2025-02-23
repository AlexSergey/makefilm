import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';

import { REMOVE_EXPIRED_SESSION_EVENT } from '../../events/user-management.event';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  handleCron(): void {
    this.logger.debug('Expired sessions will be removed');

    this.eventEmitter.emit(REMOVE_EXPIRED_SESSION_EVENT);
  }
}
