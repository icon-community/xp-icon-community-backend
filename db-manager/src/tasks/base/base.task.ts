import { Logger } from "@nestjs/common";
import { TaskInput } from "../../shared/types/GeneralTypes";
import { SeasonsService } from "../../collections/seasons/seasons.service";
import { TasksService } from "../../collections/tasks/tasks.service";
import { UsersService } from "../../collections/users/users.service";
import { UserTasksService } from "../../collections/user-tasks/user-tasks.service";
import { Types } from "mongoose";

export class BaseTask {
  private readonly logger: Logger;
  protected readonly seasonsService: SeasonsService;
  protected readonly tasksService: TasksService;
  protected readonly usersService: UsersService;
  protected readonly userTasksService: UserTasksService;

  constructor(
    seasonsService: SeasonsService,
    tasksService: TasksService,
    usersService: UsersService,
    userTasksService: UserTasksService,
  ) {
    this.logger = new Logger(this.constructor.name);
    this.seasonsService = seasonsService;
    this.tasksService = tasksService;
    this.usersService = usersService;
    this.userTasksService = userTasksService;
  }

  async execute(
    taskInput: TaskInput,
    callback: (arg: TaskInput) => Promise<void>,
    taskType: string,
  ): Promise<void> {
    try {
      this.logger.log({
        level: "info",
        message: `${this.constructor.name} begin execution. Task Input: ${JSON.stringify(taskInput)}`,
      });

      // Fetch the target task from the database
      const targetTask = await this.tasksService.findBySeedId(taskType);

      // validate the task document
      if (!targetTask) {
        this.logger.log({
          level: "info",
          message: `${this.constructor.name} task ${taskType} not found in the database. Task execution skipped.`,
        });
        return;
      }

      // Fetch active seasons from the database
      const activeSeasons = await this.seasonsService.findActiveSeasons();

      if (activeSeasons.length === 0) {
        this.logger.log({
          level: "info",
          message: `${this.constructor.name} no active seasons found. Task execution skipped.`,
        });
        return;
      }

      // Iterate over each active season
      for (const season of activeSeasons) {
        // if the current block is not within the season's block range, skip the season
        if (
          taskInput.height < season.blockStart ||
          taskInput.height > season.blockEnd
        ) {
          this.logger.log({
            level: "info",
            message: `${this.constructor.name} block height ${taskInput.height} is outside of season ${season._id} block range. Task execution skipped.`,
          });
          continue;
        }
        // Fetch the tasks for this active season
        const tasks = season.tasks;

        // Search for the taskType to be executed inside the
        // tasks in the active season
        const taskIsInSeason = tasks.some(
          (taskId) => taskId.toString() === targetTask._id.toString(),
        );

        if (!taskIsInSeason) {
          this.logger.log({
            level: "info",
            message: `${this.constructor.name} task ${taskType} not found in active season. Task execution skipped.`,
          });
          continue;
        }

        // Fetch all the users in this season
        const allUsers = await this.usersService.findUsersBySeason(
          new Types.ObjectId(season._id?.toString()),
        );

        if (allUsers.length === 0) {
          this.logger.log({
            level: "info",
            message: `${this.constructor.name} no users found in season ${season._id}. Task execution skipped.`,
          });
          continue;
        }

        // Iterate over each user in the season
        for (const currentUser of allUsers) {
          // Check user registration agains the current
          // block
          const seasonRegistrationData = currentUser.seasons.find(
            (seasonRegistrationInfo) => {
              return (
                seasonRegistrationInfo.seasonId.toString() ===
                season._id.toString()
              );
            },
          );
          if (
            seasonRegistrationData.registrationBlock == null ||
            seasonRegistrationData.registrationBlock > taskInput.height
          ) {
            this.logger.log({
              level: "info",
              message: `${this.constructor.name} user ${currentUser._id} has an invalid registrationBlock (${seasonRegistrationData.registrationBlock}) or current block height is lower than user registrationBlock for season ${season._id}. Task execution skipped.`,
            });
            continue;
          }

          // initialize user-task data
          let userTasksData = {};

          // Fetch the current user-task document
          const currentUserTaskDocument =
            await this.userTasksService.findByAllIds(
              new Types.ObjectId(currentUser._id.toString()),
              new Types.ObjectId(targetTask._id.toString()),
              new Types.ObjectId(season._id.toString()),
            );

          // if the user-task document from the database
          // is not null, copy the data
          if (currentUserTaskDocument != null) {
            userTasksData = { ...currentUserTaskDocument };
          }

          // Check if the task has already been executed
          //TODO: continue
          // Execute custom task logic from child class
          await callback(taskInput);
        }
      }
    } catch (err) {
      this.logger.error({
        level: "error",
        message: `${this.constructor.name} error: ${err.message}`,
        error: err,
      });
    }
  }

  // async addXpToUserTaskDocument(documentId: string, data: any): Promise<void> {
  //   //
  // }
}
