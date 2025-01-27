import { Injectable } from '@nestjs/common';
import { TaskProducerService } from './tasks/task-producer.service';
import { TRIGGERED_TASKS_TYPES } from './constants';

@Injectable()
export class AppService {
  constructor(private taskProducerService: TaskProducerService) {}

  async subscribeNewsletter() {
    await this.taskProducerService.sendTaskToTriggeredQueue({
      taskName: TRIGGERED_TASKS_TYPES.subscribeNewsletter,
    });
  }

  // TODO the following methods are for future
  // implementation of implementing and endpoint that
  // can be called to update the database with new data
  // async updateTasksInDb() {
  //   await this.taskProducerService.sendTaskToTriggeredQueue(
  //     {
  //       taskName: TRIGGERED_TASKS_TYPES.feedTaskSeedToDb,
  //     },
  //     true,
  //   );
  // }

  // async updateSeasonsInDb() {
  //   await this.taskProducerService.sendTaskToTriggeredQueue(
  //     {
  //       taskName: TRIGGERED_TASKS_TYPES.feedSeasonSeedToDb,
  //     },
  //     true,
  //   );
  // }
}
