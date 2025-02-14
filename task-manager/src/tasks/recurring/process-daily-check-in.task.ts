import { Injectable } from "@nestjs/common";
import { TasksService } from "../../collections/tasks/tasks.service";
import { SeasonsService } from "../../collections/seasons/seasons.service";
import { UsersService } from "../../collections/users/users.service";
import { UserResponse } from "../../collections/users/schemas/users.schema";
import { SeasonDocument } from "../../collections/seasons/schemas/seasons.schema";
import { TaskDocument } from "../../collections/tasks/schemas/tasks.schema";
import { TaskInput } from "../../shared/types/GeneralTypes";
import { BaseTask } from "../base/base.task";
import { RECURRING_TASKS_TYPES } from "../../constants";

@Injectable()
export class ProcessDailyCheckInTask extends BaseTask {
  private readonly taskType = RECURRING_TASKS_TYPES.dailyCheckInCrossChain;

  constructor(
    seasonsService: SeasonsService,
    tasksService: TasksService,
    usersService: UsersService,
  ) {
    super(seasonsService, tasksService, usersService);
    this.taskType = RECURRING_TASKS_TYPES.dailyCheckInCrossChain;
  }

  getTaskType(): string {
    return this.taskType;
  }

  async processTask(
    taskInput: TaskInput,
    userDocument: UserResponse,
    seasonDocument: SeasonDocument,
    taskDocument: TaskDocument,
  ): Promise<void> {
    try {
      //TODO: put logic to process task here
      const xpObj = {
        period: taskInput.prepTerm,
        xp: 0,
        block: taskInput.height,
      };
      void xpObj;
      void userDocument;
      void seasonDocument;
      void taskDocument;
      this.logger.log({
        level: "info",
        message: `Processing ProcessDailyCheckInTask`,
      });
    } catch (err) {
      this.logger.error(`Error in ProcessDailyCheckInTask: ${err.message}`);
    }
  }
}
