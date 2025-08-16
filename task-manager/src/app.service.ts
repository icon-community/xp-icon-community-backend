import { Injectable } from "@nestjs/common";
import { TaskProducerService } from "./tasks/task-producer.service";
import { TRIGGERED_TASKS_TYPES } from "./constants";
import { TaskInputTypeRegistration } from "./shared/types/GeneralTypes";

@Injectable()
export class AppService {
  constructor(private taskProducerService: TaskProducerService) {}

  async subscribeNewsletter() {
    await this.taskProducerService.sendTaskToTriggeredQueue({
      taskName: TRIGGERED_TASKS_TYPES.subscribeNewsletter,
    });
  }

  async awardRegistrationXp(params: TaskInputTypeRegistration) {
    await this.taskProducerService.sendTaskToTriggeredQueue({
      taskName: TRIGGERED_TASKS_TYPES.awardRegistrationXp,
      params: params,
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
