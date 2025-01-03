import { Injectable } from '@nestjs/common';
import { TaskProducerService } from './tasks/task-producer.service';
import { GENERAL_CONFIG } from './config/general.config';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  constructor(private taskProducerService: TaskProducerService) {}

  async subscribeNewsletter() {
    await this.taskProducerService.sendTaskToTriggeredQueue({
      taskName: GENERAL_CONFIG.tasks.triggered.subscribeNewsletter,
    });
  }
}
