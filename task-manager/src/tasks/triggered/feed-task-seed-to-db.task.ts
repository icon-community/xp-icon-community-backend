import { Injectable, Logger } from "@nestjs/common";
import { TasksService } from "../../collections/tasks/tasks.service";
import { ConfigHelperService } from "../../config/config-helper.service";

@Injectable()
export class FeedTaskSeedToDbTask {
  private readonly logger = new Logger(FeedTaskSeedToDbTask.name);

  constructor(
    private readonly tasksService: TasksService,
    private readonly configHelperService: ConfigHelperService,
  ) {}

  async execute(...args: any[]) {
    const [forceUpdate, callbackSetPaused] = args;
    try {
      this.logger.log({
        level: "info",
        message: `FeedTaskSeedToDbTask begin execution. Force flag: ${forceUpdate}`,
      });

      // fetch all existing tasks
      const existingTasks = await this.tasksService.findAll();
      const seedTasks = this.configHelperService.getTasks();
      // Compare tasks in seedTasks to existingTasks
      // if the task is not in existingTasks, create it
      for (const task of seedTasks) {
        if (!existingTasks.find((t) => t.seedId === task.seedId)) {
          await this.tasksService.create(task);
          this.logger.log({
            level: "info",
            message: `FeedTaskSeedToDbTask created task: ${task.seedId}`,
          });
        } else {
          this.logger.log({
            level: "info",
            message: `FeedTaskSeedToDbTask task already exists: ${task.seedId}`,
          });
          // if forceUpdate is true, update the task
          if (forceUpdate) {
            await this.tasksService.update({ seedId: task.seedId }, task);
            this.logger.log({
              level: "info",
              message: `FeedTaskSeedToDbTask updated task: ${task.seedId}`,
            });
          }
        }
      }
      callbackSetPaused(false);
    } catch (err) {
      this.logger.error({
        level: "error",
        message: `FeedTaskSeedToDbTask error: ${err.message}`,
        error: err,
      });
      callbackSetPaused(false);
    }
  }
}
