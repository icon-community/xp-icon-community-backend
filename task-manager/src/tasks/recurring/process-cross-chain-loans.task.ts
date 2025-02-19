import { Injectable } from "@nestjs/common";
import { TasksService } from "../../collections/tasks/tasks.service";
import { TaskDocument } from "../../collections/tasks/schemas/tasks.schema";
import { SeasonsService } from "../../collections/seasons/seasons.service";
import { SeasonDocument } from "../../collections/seasons/schemas/seasons.schema";
import { UsersService } from "../../collections/users/users.service";
import { UserResponse } from "../../collections/users/schemas/users.schema";
// import { UserTasksService } from "../../collections/user-tasks/user-tasks.service";
import { TaskInputTypeRecurring } from "../../shared/types/GeneralTypes";
import { BaseTask } from "../base/base.task";
import { RECURRING_TASKS_TYPES } from "../../constants";

@Injectable()
export class ProcessCrossChainLoansTask extends BaseTask {
  private readonly taskType = RECURRING_TASKS_TYPES.mintingBnusdCrossChain;
  constructor(
    seasonsService: SeasonsService,
    tasksService: TasksService,
    usersService: UsersService,
  ) {
    super(seasonsService, tasksService, usersService);
    this.taskType = RECURRING_TASKS_TYPES.mintingBnusdCrossChain;
  }

  getTaskType(): string {
    return this.taskType;
  }

  async processTask(
    taskInput: TaskInputTypeRecurring,
    userDocument: UserResponse,
    seasonDocument: SeasonDocument,
    taskDocument: TaskDocument,
  ): Promise<void> {
    try {
      void taskInput;
      void userDocument;
      void seasonDocument;
      void taskDocument;
      this.logger.log({
        level: "info",
        message: `Processing ${this.constructor.name} task`,
      });
    } catch (err) {
      this.logger.error(
        `Error processing ${this.constructor.name} task: ${err.message}`,
      );
    }
  }
}
