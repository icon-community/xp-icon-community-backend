import { Injectable } from '@nestjs/common';
import { TasksService } from '../../collections/tasks/tasks.service';
import { ConfigHelperService } from '../../config/config-helper.service';
import { TaskInput } from '../../shared/types/GeneralTypes';
import { BaseTask } from '../base/base.task';

@Injectable()
export class ProcessLoansTask extends BaseTask {
  constructor(
    private readonly tasksService: TasksService,
    private readonly configHelperService: ConfigHelperService,
  ) {
    super();
  }

  async execute(taskInput: TaskInput): Promise<void> {
    await super.execute(taskInput, this.main.bind(this));
  }

  private async main(taskInput: TaskInput): Promise<void> {
    // TODO: put task execution logic here
    void taskInput;
  }
}
