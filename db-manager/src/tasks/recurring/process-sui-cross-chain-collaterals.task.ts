import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { TasksService } from '../../collections/tasks/tasks.service';
import { ConfigHelperService } from '../../config/config-helper.service';

@Injectable()
export class ProcessSuiCrossChainCollateralsTask {
  private readonly logger = new Logger(
    ProcessSuiCrossChainCollateralsTask.name,
  );

  constructor(
    private readonly tasksService: TasksService,
    private readonly configHelperService: ConfigHelperService,
  ) {}

  async execute({ blockHeight }) {
    try {
      this.logger.log({
        level: 'info',
        message: `ProcessSuiCrossChainCollateralsTask begin execution. Block height: ${blockHeight}`,
      });
    } catch (err) {
      this.logger.error({
        level: 'error',
        message: `ProcessSuiCrossChainCollateralsTask error: ${err.message}`,
        error: err,
      });
    }
  }
}
