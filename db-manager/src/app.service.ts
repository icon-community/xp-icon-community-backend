import { Injectable } from '@nestjs/common';
import { TaskProducerService } from './tasks/task-producer.service';
import { TRIGGERED_TASKS_TYPES } from './constants';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  constructor(private taskProducerService: TaskProducerService) {}

  async subscribeNewsletter() {
    await this.taskProducerService.sendTaskToTriggeredQueue({
      taskName: TRIGGERED_TASKS_TYPES.subscribeNewsletter,
    });
  }
}
