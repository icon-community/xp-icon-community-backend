import { Injectable } from '@nestjs/common';
import { CheckBlockchainTask, Task1Task } from './recurring';
import {
  SubscribeNewsletterTask,
  ClickButtonTask,
  FeedTaskSeedToDbTask,
} from './triggered';
import { TRIGGERED_TASKS_TYPES } from '../constants';
@Injectable()
export class TaskService {
  constructor(
    private readonly checkBlockchainTask: CheckBlockchainTask,
    private readonly task1Task: Task1Task,
    private readonly subscribeNewsletterTask: SubscribeNewsletterTask,
    private readonly clickButtonTask: ClickButtonTask,
    private readonly feedTaskSeedToDbTask: FeedTaskSeedToDbTask,
  ) {}

  executeRecurringTasks() {
    this.checkBlockchainTask.execute();
    this.task1Task.execute();
  }

  executeTriggeredTasks(taskName: string) {
    switch (taskName) {
      case TRIGGERED_TASKS_TYPES.subscribeNewsletter:
        this.subscribeNewsletterTask.execute();
        break;
      case TRIGGERED_TASKS_TYPES.clickButton:
        this.clickButtonTask.execute();
        break;
      case TRIGGERED_TASKS_TYPES.feedTaskSeedToDbForce:
        this.feedTaskSeedToDbTask.execute(true);
        break;
      case TRIGGERED_TASKS_TYPES.feedTaskSeedToDb:
        this.feedTaskSeedToDbTask.execute(false);
        break;
      default:
        console.log('Unknown triggered task');
    }
  }
}
