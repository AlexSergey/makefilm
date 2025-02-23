import { Module } from '@nestjs/common';

import { TasksService } from './tasks.service';

@Module({
  controllers: [],
  imports: [],
  providers: [TasksService],
})
export class TasksModule {}
