import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { RABBITMQ_CONFIG } from '../config/rabbitmq.config';
import { TRIGGERED_TASKS_TYPES } from '../constants';
import { TaskObject } from '../shared/types/GeneralTypes';

@Injectable()
export class TaskProducerService implements OnModuleInit {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async onModuleInit() {
    const priorityTasks = [
      {
        // IMPORTANT: this should be the first task to be executed, DO NOT CHANGE THE ORDER
        // TODO: add priority to tasks
        taskName: TRIGGERED_TASKS_TYPES.feedTaskSeedToDb,
      },
      {
        taskName: TRIGGERED_TASKS_TYPES.feedSeasonSeedToDb,
      },
    ];

    for (const task of priorityTasks) {
      this.rabbitMQService.sendToQueue(
        RABBITMQ_CONFIG.queues.triggeredTasks,
        task,
      );
    }

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
