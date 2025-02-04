import { Logger } from "@nestjs/common";
import { TaskInput } from "../../shared/types/GeneralTypes";
import { UserTaskStatus } from "../../shared/enum/general-enum";
import { SeasonsService } from "../../collections/seasons/seasons.service";
import { TasksService } from "../../collections/tasks/tasks.service";
import { UsersService } from "../../collections/users/users.service";
import { UserTasksService } from "../../collections/user-tasks/user-tasks.service";
import { XpEarned } from "../../collections/user-tasks/schemas/user-tasks.schema";
import { Types } from "mongoose";

export class BaseTask {
  readonly logger: Logger;
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
    callback: (arg: TaskInput) => Promise<XpEarned>,
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

          try {
            await callback(
              taskInput,
              userDocument,
              seasonDocument,
              taskDocument,
            );
          } catch (err) {
            this.logger.error({
              level: "error",
              message: `${this.constructor.name} error: ${err.message}`,
              error: err,
            });
          }

          // // initialize user-task data
          // const userTasksData = {
          //   userId: new Types.ObjectId(currentUser._id.toString()),
          //   taskId: new Types.ObjectId(targetTask._id.toString()),
          //   seasonId: new Types.ObjectId(season._id.toString()),
          //   xpEarned: [],
          //   status: UserTaskStatus.PENDING,
          //   walletAddress: currentUser.walletAddress,
          // };

          // // Fetch the current user-task document
          // const currentUserTaskDocument =
          //   await this.userTasksService.findByAllIds(
          //     userTasksData.userId,
          //     userTasksData.taskId,
          //     userTasksData.seasonId,
          //   );

          // let xpObj = {
          //   period: taskInput.prepTerm,
          //   xp: 0,
          //   block: taskInput.height,
          // };
          // try {
          //   // Execute custom task logic from child class
          //   // to calculate the new xp
          //   xpObj = await callback(taskInput);

          //   // TODO push new xp to userTasksData.xpEarned
          // } catch (err) {
          //   this.logger.error(
          //     `Error calculating new XP on task ${this.constructor.name}: ${err.message}`,
          //   );
          //   continue;
          // }
          // if (currentUserTaskDocument == null) {
          //   userTasksData.xpEarned.push(xpObj);
          //   await this.userTasksService.create(userTasksData);
          // } else {
          //   // Check if the task has already been executed
          //   if (currentUserTaskDocument.xpEarned.length > 0) {
          //     const taskAlreadyExecuted = currentUserTaskDocument.xpEarned.some(
          //       (xpDoc: XpEarned) => {
          //         return xpDoc.period === taskInput.prepTerm;
          //       },
          //     );

          //     if (taskAlreadyExecuted) {
          //       this.logger.log({
          //         // If the task has already been executed, skip the user
          //         level: "info",
          //         message: `${this.constructor.name} task ${taskType} already executed for user ${currentUser._id} in season ${season._id}. Task execution skipped.`,
          //       });

          //       continue;
          //     }
          //     // add new xp to the existing user-task document
          //     await this.userTasksService.addXp(
          //       currentUserTaskDocument._id,
          //       xpObj,
          //     );
          //   }
          // }
        }
      }
    } catch (err) {
      throw new Error(
        `Error executing task ${this.constructor.name}: ${err.message}`,
      );
    }
  }
}
