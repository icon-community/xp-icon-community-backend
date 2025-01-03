import { Injectable } from '@nestjs/common';
import { CheckBlockchainTask } from './recurring/check-blockchain.task';
import { Task1Task } from './recurring/task1.task';
import { SubscribeNewsletterTask } from './triggered/subscribe-newsletter.task';
import { ClickButtonTask } from './triggered/click-button.task';
import { GENERAL_CONFIG } from '../config/general.config';
@Injectable()
export class TaskService {
  constructor(
    private readonly checkBlockchainTask: CheckBlockchainTask,
    private readonly task1Task: Task1Task,
    private readonly subscribeNewsletterTask: SubscribeNewsletterTask,
    private readonly clickButtonTask: ClickButtonTask,
  ) {}

  executeRecurringTasks() {
    this.checkBlockchainTask.execute();
    this.task1Task.execute();
  }

  executeTriggeredTasks(taskName: string) {
    switch (taskName) {
      case GENERAL_CONFIG.tasks.triggered.subscribeNewsletter:
        this.subscribeNewsletterTask.execute();
        break;
      case GENERAL_CONFIG.tasks.triggered.clickButton:
        this.clickButtonTask.execute();
        break;
      default:
        console.log('Unknown triggered task');
    }
  }
}
