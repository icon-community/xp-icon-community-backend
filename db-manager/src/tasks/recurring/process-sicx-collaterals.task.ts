import { Injectable } from '@nestjs/common';
import { TasksService } from '../../collections/tasks/tasks.service';
import { SeasonsService } from '../../collections/seasons/seasons.service';
import { UsersService } from '../../collections/users/users.service';
import { ConfigHelperService } from '../../config/config-helper.service';
import { TaskInput } from '../../shared/types/GeneralTypes';
import { BaseTask } from '../base/base.task';
import { RECURRING_TASKS_TYPES } from '../../constants';

@Injectable()
export class ProcessSicxCollateralsTask extends BaseTask {
  private readonly taskType = RECURRING_TASKS_TYPES.depositSicxICON;
  constructor(
    tasksService: TasksService,
    seasonsService: SeasonsService,
    usersService: UsersService,
    private readonly configHelperService: ConfigHelperService,
  ) {
    super(seasonsService, tasksService, usersService);
    this.taskType = RECURRING_TASKS_TYPES.depositSicxICON;
  }

  async execute(taskInput: TaskInput): Promise<void> {
    await super.execute(taskInput, this.main.bind(this), this.taskType);
  }

  private async main(taskInput: TaskInput): Promise<void> {
    // TODO: put task execution logic here
    void taskInput;
  }
}
