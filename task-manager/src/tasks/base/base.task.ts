import { Logger } from "@nestjs/common";
import { TaskInput } from "../../shared/types/GeneralTypes";
import { UserTaskStatus } from "../../shared/enum/general-enum";
import { SeasonsService } from "../../collections/seasons/seasons.service";
import { SeasonDocument } from "../../collections/seasons/schemas/seasons.schema";
import { TasksService } from "../../collections/tasks/tasks.service";
import { TaskDocument } from "../../collections/tasks/schemas/tasks.schema";
import { UsersService } from "../../collections/users/users.service";
import { UserDocument } from "../../collections/users/schemas/users.schema";
import { UserTasksService } from "../../collections/user-tasks/user-tasks.service";
import { UserTasksDocument } from "../../collections/user-tasks/schemas/user-tasks.schema";
import { XpEarned } from "../../collections/user-tasks/schemas/user-tasks.schema";
import { Types } from "mongoose";

export abstract class BaseTask {
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

  async execute(taskInput: TaskInput): Promise<void> {
    try {
      this.logTaskStart(taskInput);

      const targetTask = await this.validateTask();
      if (!targetTask) return;

      const activeSeasons = await this.findActiveSeasons();
      if (!activeSeasons.length) return;

      await this.processSeasons(activeSeasons, taskInput, targetTask);
    } catch (err) {
      throw new Error(
        `Error executing task ${this.constructor.name}: ${err.message}`,
      );
    }
  }

  protected abstract getTaskType(): string;
  protected abstract calculateXp(
    taskInput: TaskInput,
    userDocument: UserDocument,
    seasonDocument: SeasonDocument,
    taskDocument: TaskDocument,
  ): Promise<XpEarned>;

  protected logTaskStart(taskInput: TaskInput): void {
    this.logger.log({
      level: "info",
      message: `${this.constructor.name} begin execution. Task Input: ${JSON.stringify(taskInput)}`,
    });
  }

  protected handleError(err: Error): void {
    const message = `${this.constructor.name} error: ${err.message}`;
    this.logger.error({
      level: "error",
      message: message,
      error: err,
    });

    throw new Error(message);
  }

  private async validateTask(): Promise<TaskDocument | null> {
    const targetTask = await this.tasksService.findBySeedId(this.getTaskType());

    if (!targetTask) {
      this.logger.log({
        level: "info",
        message: `${this.constructor.name} task ${this.getTaskType()} not found in the database. Task execution skipped.`,
      });
    }

    return targetTask;
  }

  private async findActiveSeasons(): Promise<SeasonDocument[]> {
    const activeSeasons = await this.seasonsService.findActiveSeasons();

    if (activeSeasons.length === 0) {
      this.logger.log({
        level: "info",
        message: `${this.constructor.name} no active seasons found. Task execution skipped.`,
      });
    }

    return activeSeasons;
  }

  private async processSeasons(
    activeSeasons: SeasonDocument[],
    taskInput: TaskInput,
    targetTask: TaskDocument,
  ): Promise<void> {
    for (const season of activeSeasons) {
      if (!this.isBlockInSeasonRange(taskInput.height, season)) {
        continue;
      }

      if (!this.isTaskInSeason(targetTask, season)) {
        continue;
      }

      await this.processUsersForSeason(season, taskInput, targetTask);
    }
  }

  private isBlockInSeasonRange(
    height: number,
    season: SeasonDocument,
  ): boolean {
    if (height < season.blockStart || height > season.blockEnd) {
      this.logger.log({
        level: "info",
        message: `${this.constructor.name} block height ${height} is outside of season ${season._id} block range. Task execution skipped.`,
      });

      return false;
    }

    return true;
  }

  private isTaskInSeason(task: TaskDocument, season: SeasonDocument): boolean {
    const taskIsInSeason = season.tasks.some(
      (taskId) => taskId.toString() === task._id.toString(),
    );

    if (!taskIsInSeason) {
      this.logger.log({
        level: "info",
        message: `${this.constructor.name} task ${task.seedId} not found in active season. Task execution skipped.`,
      });
    }

    return taskIsInSeason;
  }

  private async processUsersForSeason(
    season: SeasonDocument,
    taskInput: TaskInput,
    targetTask: TaskDocument,
  ): Promise<void> {
    const users = await this.usersService.findUsersBySeason(
      new Types.ObjectId(season._id?.toString()),
    );

    if (users.length === 0) {
      this.logger.log({
        level: "info",
        message: `${this.constructor.name} no users found in season ${season._id}. Task execution skipped.`,
      });

      return;
    }

    for (const user of users) {
      if (!this.isUserEligible(user, season, taskInput.height)) {
        continue;
      }

      try {
        const xpEarned = await this.calculateXp(
          taskInput,
          user,
          season,
          targetTask,
        );
        await this.processXpEarned(user, season, targetTask, xpEarned);
      } catch (err) {
        this.logger.error({
          level: "error",
          message: `${this.constructor.name} error processing user ${user._id}: ${err.message}`,
          error: err,
        });
      }
    }
  }

  private isUserEligible(
    user: UserDocument,
    season: SeasonDocument,
    height: number,
  ): boolean {
    const seasonRegistrationData = user.seasons.find(
      (seasonRegistrationInfo) => {
        return (
          seasonRegistrationInfo.seasonId.toString() === season._id.toString()
        );
      },
    );

    if (
      seasonRegistrationData.registrationBlock == null ||
      seasonRegistrationData.registrationBlock > height
    ) {
      this.logger.log({
        level: "info",
        message: `${this.constructor.name} user ${user._id} has an invalid registrationBlock (${seasonRegistrationData.registrationBlock}) or current block height is lower than user registrationBlock for season ${season._id}. Task execution skipped.`,
      });

      return false;
    }

    return true;
  }

  private async processXpEarned(
    user: UserDocument,
    season: SeasonDocument,
    task: TaskDocument,
    xpEarned: XpEarned,
  ): Promise<void> {
    console.log("TODO");
  }
}
