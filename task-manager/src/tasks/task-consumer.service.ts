import { Injectable, OnModuleInit } from "@nestjs/common";
import { RabbitMQService } from "../rabbitmq/rabbitmq.service";
import { RABBITMQ_CONFIG } from "../config/rabbitmq.config";
import { TaskService } from "./task.service";
import { Logger } from "@nestjs/common";

@Injectable()
export class TaskConsumerService implements OnModuleInit {
  private readonly logger: Logger;
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly taskService: TaskService,
  ) {
    this.logger = new Logger(TaskConsumerService.name);
  }

  async onModuleInit() {
    // consume recurring tasks
    this.rabbitMQService.consume(
      RABBITMQ_CONFIG.queues.recurringTasks,
      async (message, callback) => {
        void callback;
        this.logger.log({
          level: "info",
          message: `Executing recurring tasks:, ${JSON.stringify(message)}`,
        });
        this.taskService.executeRecurringTasks(message);
      },
    );

    // consume triggered tasks
    this.rabbitMQService.consume(
      RABBITMQ_CONFIG.queues.triggeredTasks,
      async (message, callbackSetPaused) => {
        this.logger.log({
          level: "info",
          message: `Executing triggered tasks:, ${JSON.stringify(message)}`,
        });
        this.taskService.executeTriggeredTasks(message, callbackSetPaused);
      },
    );
  }
}
