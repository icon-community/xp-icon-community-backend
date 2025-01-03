import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { RABBITMQ_CONFIG } from '../config/rabbitmq.config';
import { TaskObject } from '../types/types';
@Injectable()
export class TaskProducerService implements OnModuleInit {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async onModuleInit() {
    setInterval(() => {
      this.rabbitMQService.sendToQueue(RABBITMQ_CONFIG.queues.recurringTasks, {
        task: 'recurringTask',
        timestamp: Date.now(),
      });
    }, 10000);
  }

  async sendTaskToTriggeredQueue(task: TaskObject) {
    this.rabbitMQService.sendToQueue(
      RABBITMQ_CONFIG.queues.triggeredTasks,
      task,
    );
  }
}
