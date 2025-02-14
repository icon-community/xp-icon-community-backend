import { Logger } from "@nestjs/common";
import { TaskInput } from "../../shared/types/GeneralTypes";
import { SeasonsService } from "../../collections/seasons/seasons.service";
import { SeasonDocument } from "../../collections/seasons/schemas/seasons.schema";
import { TasksService } from "../../collections/tasks/tasks.service";
import { TaskDocument } from "../../collections/tasks/schemas/tasks.schema";
import { UsersService } from "../../collections/users/users.service";
import { UserDocument } from "../../collections/users/schemas/users.schema";
import { Types } from "mongoose";

export abstract class BaseTask {
  readonly logger: Logger;
  protected readonly seasonsService: SeasonsService;
  protected readonly tasksService: TasksService;
  protected readonly usersService: UsersService;

  constructor(
    seasonsService: SeasonsService,
    tasksService: TasksService,
    usersService: UsersService,
  ) {
    this.logger = new Logger(this.constructor.name);
    this.seasonsService = seasonsService;
    this.tasksService = tasksService;
    this.usersService = usersService;
  }

  // main template method
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

  // Abstract methods that must be implemented by child classes
  protected abstract getTaskType(): string;
  protected abstract processTask(
    taskInput: TaskInput,
    userDocument: UserDocument,
    seasonDocument: SeasonDocument,
    taskDocument: TaskDocument,
  ): Promise<void>;

  protected logTaskStart(taskInput: TaskInput): void {
    this.logger.log({
      level: "info",
      message: `${this.constructor.name} begin execution. Task Input: ${JSON.stringify(taskInput)}`,
    });
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
        // This method is implemented by the child class
        // each task will have its own implementation
        await this.processTask(taskInput, user, season, targetTask);
      } catch (err) {
        this.logger.error({
          level: "error",
          message: `${this.constructor.name} error processing user ${user._id}: ${err.message}`,
          error: err,
        });
      }
    }
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
}
