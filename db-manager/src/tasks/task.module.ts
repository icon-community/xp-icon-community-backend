import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { CheckBlockchainTask, Task1Task } from './recurring';
import { ClickButtonTask, SubscribeNewsletterTask } from './triggered';

@Module({
  imports: [],
  providers: [
    TaskService,
    CheckBlockchainTask,
    Task1Task,
    ClickButtonTask,
    SubscribeNewsletterTask,
  ],
  exports: [TaskService],
})
export class TaskModule {}
