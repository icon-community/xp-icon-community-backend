import { Module } from '@nestjs/common';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { TaskProducerService } from './task-producer.service';
import { TaskService } from './task.service';
import { CheckBlockchainTask } from './recurring/check-blockchain.task';
import { Task1Task } from './recurring/task1.task';
import { SubscribeNewsletterTask } from './triggered/subscribe-newsletter.task';
import { ClickButtonTask } from './triggered/click-button.task';

@Module({
  imports: [RabbitMQModule],
  providers: [
    TaskProducerService,
    TaskService,
    CheckBlockchainTask,
    Task1Task,
    SubscribeNewsletterTask,
    ClickButtonTask,
  ],
  exports: [TaskProducerService],
})
export class TaskProducerModule {}
