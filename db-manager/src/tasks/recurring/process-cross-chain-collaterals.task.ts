import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { TasksService } from '../../collections/tasks/tasks.service';
import { ConfigHelperService } from '../../config/config-helper.service';

@Injectable()
export class ProcessCrossChainCollateralsTask {
  private readonly logger = new Logger(ProcessCrossChainCollateralsTask.name);

  constructor(
    private readonly tasksService: TasksService,
    private readonly configHelperService: ConfigHelperService,
  ) {}

  async execute({ blockHeight }) {
    try {
      this.logger.log({
        level: 'info',
        message: `ProcessCrossChainCollateralsTask begin execution. Block height: ${blockHeight}`,
      });
    } catch (err) {
      this.logger.error({
        level: 'error',
        message: `ProcessCrossChainCollateralsTask error: ${err.message}`,
        error: err,
      });
    }
  }
}
