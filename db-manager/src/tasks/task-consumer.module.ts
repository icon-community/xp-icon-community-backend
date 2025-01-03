import { Module } from '@nestjs/common';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { TaskConsumerService } from './task-consumer.service';
import { TaskModule } from './task.module';
import { Logger } from '@nestjs/common';

@Module({
  imports: [RabbitMQModule, TaskModule],
  providers: [TaskConsumerService, Logger],
})
export class TaskConsumerModule {}
