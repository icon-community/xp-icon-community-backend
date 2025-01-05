import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { CheckBlockchainTask, Task1Task } from './recurring';
import {
  SubscribeNewsletterTask,
  ClickButtonTask,
  FeedTaskSeedToDbTask,
  FeedSeasonSeedToDbTask,
} from './triggered';
import { TRIGGERED_TASKS_TYPES } from '../constants';
@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(
    private readonly checkBlockchainTask: CheckBlockchainTask,
    private readonly task1Task: Task1Task,
    private readonly subscribeNewsletterTask: SubscribeNewsletterTask,
    private readonly clickButtonTask: ClickButtonTask,
    private readonly feedTaskSeedToDbTask: FeedTaskSeedToDbTask,
    private readonly feedSeasonSeedToDbTask: FeedSeasonSeedToDbTask,
  ) {}

  executeRecurringTasks() {
    const recurringTasks = [this.checkBlockchainTask, this.task1Task];
    for (const task of recurringTasks) {
      try {
        this.logger.log({
          level: 'info',
          message: `Executing task: ${task.constructor.name}`,
        });
        task.execute();
      } catch (err) {
        this.logger.log({
          level: 'error',
          message: `Error executing task: ${task.constructor.name}. Message: ${err.message}`,
          error: err,
        });
      }
    }
  }

  executeTriggeredTasks(taskName: string, callbackSetPaused) {
    const triggeredTasks = [
      {
        label: TRIGGERED_TASKS_TYPES.subscribeNewsletter,
        callback: this.subscribeNewsletterTask,
        params: [callbackSetPaused],
      },
      {
        label: TRIGGERED_TASKS_TYPES.clickButton,
        callback: this.clickButtonTask,
        params: [callbackSetPaused],
      },
      {
        label: TRIGGERED_TASKS_TYPES.feedTaskSeedToDbForce,
        callback: this.feedTaskSeedToDbTask,
        params: [true, callbackSetPaused],
      },
      {
        label: TRIGGERED_TASKS_TYPES.feedTaskSeedToDb,
        callback: this.feedTaskSeedToDbTask,
        params: [false, callbackSetPaused],
      },
      {
        label: TRIGGERED_TASKS_TYPES.feedSeasonSeedToDb,
        callback: this.feedSeasonSeedToDbTask,
        params: [false, callbackSetPaused],
      },
      {
        label: TRIGGERED_TASKS_TYPES.feedSeasonSeedToDbForce,
        callback: this.feedSeasonSeedToDbTask,
        params: [true, callbackSetPaused],
      },
    ];

    if (!triggeredTasks.some((item) => item.label === taskName)) {
      this.logger.log({
        level: 'error',
        message: `Unknown triggered task: ${taskName}`,
      });
      return;
    }

    for (const task of triggeredTasks) {
      try {
        if (task.label !== taskName) {
          continue;
        } else {
          this.logger.log({
            level: 'info',
            message: `Executing task: ${task.label}`,
          });

          task.callback.execute(...task.params);
          break;
        }
      } catch (err) {
        this.logger.log({
          level: 'error',
          message: `Error executing task: ${task}. Message: ${err.message}`,
          error: err,
        });
      }
    }
  }
}
