import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { REMOVE_EXPIRED_SESSION_EVENT } from '../../events/user-management.event';
import { SessionsService } from './sessions.service';

@Injectable()
export class SessionTaskService {
  constructor(private readonly sessionService: SessionsService) {}

  @OnEvent(REMOVE_EXPIRED_SESSION_EVENT)
  async handleOrderEvents(): Promise<void> {
    await this.sessionService.removeExpiredSessions();
  }
}
