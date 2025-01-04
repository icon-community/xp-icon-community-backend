import { Module } from '@nestjs/common';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { TaskProducerService } from './task-producer.service';
import { TaskService } from './task.service';
import { ConfigHelperService } from '../config/config-helper.service';
import { Task1Task, CheckBlockchainTask } from './recurring';
import {
  SubscribeNewsletterTask,
  ClickButtonTask,
  FeedTaskSeedToDbTask,
} from './triggered';
import { TasksModule } from '../collections/tasks/tasks.module';

@Module({
  imports: [RabbitMQModule, TasksModule],
  providers: [
    TaskProducerService,
    TaskService,
    CheckBlockchainTask,
    Task1Task,
    SubscribeNewsletterTask,
    ClickButtonTask,
    FeedTaskSeedToDbTask,
    ConfigHelperService,
  ],
  exports: [TaskProducerService],
})
export class TaskProducerModule {}
