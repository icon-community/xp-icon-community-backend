import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { RABBITMQ_CONFIG } from '../config/rabbitmq.config';
import { TRIGGERED_TASKS_TYPES } from '../constants';
import { TaskObject } from '../shared/types/GeneralTypes';
import { SeasonsService } from '../collections/seasons/seasons.service';
import { getInitBlock } from '../utils/utils';

@Injectable()
export class TaskProducerService implements OnModuleInit {
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly seasonsService: SeasonsService,
  ) {}

  async onModuleInit() {
    const priorityTasks = [
      {
        task: {
          // IMPORTANT: this should be the first task to be executed, DO NOT CHANGE THE ORDER
          // TODO: add priority to tasks
          taskName: TRIGGERED_TASKS_TYPES.feedTaskSeedToDb,
        },
        haltAllTasks: true,
      },
      {
        task: {
          taskName: TRIGGERED_TASKS_TYPES.feedSeasonSeedToDb,
        },
        haltAllTasks: true,
      },
    ];

    for (const task of priorityTasks) {
      this.rabbitMQService.sendToQueue(
        RABBITMQ_CONFIG.queues.triggeredTasks,
        task.task,
        task.haltAllTasks,
      );
    }

    setInterval(async () => {
      // get last block on ICON chain
      const blockHeight = await this.getLastBlockOnIconChain();
      const allSeasons = await this.seasonService.getAllSeasons();
      const lowestBlockOnDb = await getInitBlock(allSeasons);
      const props = {
        blockHeight: blockHeight,
      };
      this.rabbitMQService.sendToQueue(
        RABBITMQ_CONFIG.queues.recurringTasks,
        props,
      );
    }, 10000);
  }

  async sendTaskToTriggeredQueue(task: TaskObject) {
    this.rabbitMQService.sendToQueue(
      RABBITMQ_CONFIG.queues.triggeredTasks,
      task,
    );
  }

  async getLastBlockOnIconChain() {
    return 0;
  }
}
