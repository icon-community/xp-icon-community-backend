import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class Task1Task {
  private readonly logger = new Logger(Task1Task.name);
  execute() {
    this.logger.log({
      level: 'info',
      message: 'Task 1 executed',
    });
  }
}
