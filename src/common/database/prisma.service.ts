import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { LoggerService } from '../logger/logger.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly logger: LoggerService) {
    super({
      log: ['error'],
    });
  }

  async onModuleInit(): Promise<void> {
    this.logger.log(`[Prisma] Prisma service initialized.`);
    await this.$connect();
  }
}
