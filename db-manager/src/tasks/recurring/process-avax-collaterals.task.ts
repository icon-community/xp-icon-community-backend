import { Injectable } from "@nestjs/common";
import { TasksService } from "../../collections/tasks/tasks.service";
import { SeasonsService } from "../../collections/seasons/seasons.service";
import { UsersService } from "../../collections/users/users.service";
import { UserTasksService } from "../../collections/user-tasks/user-tasks.service";
import { XpEarned } from "../../collections/user-tasks/schemas/user-tasks.schema";
import { ConfigHelperService } from "../../config/config-helper.service";
import { TaskInput } from "../../shared/types/GeneralTypes";
import { BaseTask } from "../base/base.task";
import { RECURRING_TASKS_TYPES } from "../../constants";

@Injectable()
export class ProcessAvaxCollateralsTask extends BaseTask {
  private readonly taskType = RECURRING_TASKS_TYPES.depositAvaxCollateral;
  constructor(
    tasksService: TasksService,
    seasonsService: SeasonsService,
    usersService: UsersService,
    userTasksService: UserTasksService,
    private readonly configHelperService: ConfigHelperService,
  ) {
    super(seasonsService, tasksService, usersService, userTasksService);
    this.taskType = RECURRING_TASKS_TYPES.depositAvaxCollateral;
  }

  async execute(taskInput: TaskInput): Promise<void> {
    try {
      await super.execute(taskInput, this.main.bind(this), this.taskType);
    } catch (err) {
      this.logger.error(`Error in ProcessAvaxCollateralsTask: ${err.message}`);
    }
  }

  private async main(taskInput: TaskInput): Promise<XpEarned> {
    try {
      const xpObj = {
        period: taskInput.prepTerm,
        xp: 0,
        block: taskInput.height,
      };

      // TODO put logic to calculate xp here
      //
      return xpObj;
    } catch (err) {
      throw new Error(`Error in ProcessAvaxCollateralsTask: ${err.message}`);
    }
  }
}
