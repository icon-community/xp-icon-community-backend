import { Logger } from '@nestjs/common';
import { TaskInput } from '../../shared/types/GeneralTypes';

export class BaseTask {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  async execute(
    taskInput: TaskInput,
    callback: (arg: TaskInput) => Promise<void>,
  ): Promise<void> {
    try {
      this.logger.log({
        level: 'info',
        message: `${this.constructor.name} begin execution. Task Input: ${JSON.stringify(taskInput)}`,
      });
      await callback(taskInput);
    } catch (err) {
      this.logger.error({
        level: 'error',
        message: `${this.constructor.name} error: ${err.message}`,
        error: err,
      });
    }
  }
}
