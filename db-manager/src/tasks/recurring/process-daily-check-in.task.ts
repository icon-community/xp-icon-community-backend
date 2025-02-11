import { Injectable } from "@nestjs/common";
import { TasksService } from "../../collections/tasks/tasks.service";
import { SeasonsService } from "../../collections/seasons/seasons.service";
import { UsersService } from "../../collections/users/users.service";
import { UserDocument } from "../../collections/users/schemas/users.schema";
import { UserTasksService } from "../../collections/user-tasks/user-tasks.service";
import { ConfigHelperService } from "../../config/config-helper.service";
import { TaskInput } from "../../shared/types/GeneralTypes";
import { BaseTask } from "../base/base.task";
import { RECURRING_TASKS_TYPES } from "../../constants";

@Injectable()
export class ProcessDailyCheckInTask extends BaseTask {
  private readonly taskType = RECURRING_TASKS_TYPES.dailyCheckInCrossChain;
  constructor(
    tasksService: TasksService,
    seasonsService: SeasonsService,
    usersService: UsersService,
    userTasksService: UserTasksService,
    private readonly configHelperService: ConfigHelperService,
  ) {
    super(seasonsService, tasksService, usersService, userTasksService);
  }

  async execute(taskInput: TaskInput): Promise<void> {
    await super.execute(taskInput, this.main.bind(this), this.taskType);
  }

  private async main(
    taskInput: TaskInput,
    userDocument: UserDocument,
  ): Promise<void> {
    // TODO: put task execution logic here
    void taskInput;
  }
}
