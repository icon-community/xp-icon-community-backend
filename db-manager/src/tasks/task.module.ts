import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { ConfigHelperService } from '../config/config-helper.service';
import { CheckBlockchainTask, Task1Task } from './recurring';
import {
  ClickButtonTask,
  SubscribeNewsletterTask,
  FeedTaskSeedToDbTask,
} from './triggered';
import { TasksModule } from '../collections/tasks/tasks.module';

@Module({
  imports: [TasksModule],
  providers: [
    TaskService,
    CheckBlockchainTask,
    Task1Task,
    ClickButtonTask,
    SubscribeNewsletterTask,
    FeedTaskSeedToDbTask,
    ConfigHelperService,
  ],
  exports: [TaskService],
})
export class TaskModule {}
