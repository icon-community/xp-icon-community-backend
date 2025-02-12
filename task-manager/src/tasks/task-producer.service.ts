import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  OnApplicationShutdown,
  Logger,
} from "@nestjs/common";
import { RabbitMQService } from "../rabbitmq/rabbitmq.service";
import { RABBITMQ_CONFIG } from "../config/rabbitmq.config";
import { TaskObject } from "../shared/types/GeneralTypes";
import { SeasonsService } from "../collections/seasons/seasons.service";
import BlockMonitorTaskRunner from "../utils/block-monitor-task-runner";
import { TaskInput } from "../shared/types/GeneralTypes";
import { TaskService } from "./task.service";

@Injectable()
export class TaskProducerService
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  private logger: Logger;
  private blockMonitorTaskRunner: BlockMonitorTaskRunner;

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly seasonsService: SeasonsService,
    private readonly taskService: TaskService,
  ) {
    this.logger = new Logger(TaskProducerService.name);
  }

  async onModuleInit() {
    try {
      // execute initial tasks
      // these tasks are required to be executed before
      // anything else at the beggining of the application
      // these tasks setup the initial state in the db
      await this.taskService.executeInitTasks();

      // start the block monitor task runner
      // this will take care of execute the recurring task
      // at the defined interval inside the block monitor
      // task runner
      this.blockMonitorTaskRunner = new BlockMonitorTaskRunner(
        this.seasonsService.findAll.bind(this.seasonsService),
        [this.sendTaskToRecurringQueue.bind(this)],
      );

      this.blockMonitorTaskRunner.start();
    } catch (err) {
      if (err.message.includes("CRITICAL")) {
        this.logger.log({
          message: err.message,
          level: "error",
          timestamp: new Date(),
        });
        throw new Error(err.message);
      }
    }
  }

  private async sendTaskToRecurringQueue(task: TaskInput) {
    this.rabbitMQService.sendToQueue(
      RABBITMQ_CONFIG.queues.recurringTasks,
      task,
    );
  }

  async sendTaskToTriggeredQueue(task: TaskObject, haltAllTasks = false) {
    this.rabbitMQService.sendToQueue(
      RABBITMQ_CONFIG.queues.triggeredTasks,
      task,
      haltAllTasks,
    );
  }

  async onModuleDestroy() {
    if (this.blockMonitorTaskRunner) {
      this.blockMonitorTaskRunner.stop();
    }
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.log({
      level: "warn",
      message: `Application is shutting down with signal: ${signal}`,
    });

    if (this.blockMonitorTaskRunner) {
      this.blockMonitorTaskRunner.stop();
    }
  }
}
