import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { TasksService } from '../../collections/tasks/tasks.service';
import { ConfigHelperService } from '../../config/config-helper.service';

@Injectable()
export class ProcessNewReferredTask {
  private readonly logger = new Logger(ProcessNewReferredTask.name);

  constructor(
    private readonly tasksService: TasksService,
    private readonly configHelperService: ConfigHelperService,
  ) {}

  async execute({ blockHeight }) {
    try {
      this.logger.log({
        level: 'info',
        message: `ProcessNewReferredTask begin execution. Block height: ${blockHeight}`,
      });
    } catch (err) {
      this.logger.error({
        level: 'error',
        message: `ProcessNewReferredTask error: ${err.message}`,
        error: err,
      });
    }
  }
}
