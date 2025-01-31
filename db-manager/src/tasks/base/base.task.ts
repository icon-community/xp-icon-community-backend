import { Logger } from '@nestjs/common';
import { TaskInput } from '../../shared/types/GeneralTypes';
import { SeasonsService } from '../../collections/seasons/seasons.service';
import { TasksService } from '../../collections/tasks/tasks.service';
import { UsersService } from '../../collections/users/users.service';
import { Types } from 'mongoose';

export class BaseTask {
  private readonly logger: Logger;
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

  async execute(
    taskInput: TaskInput,
    callback: (arg: TaskInput) => Promise<void>,
    taskType: string,
  ): Promise<void> {
    try {
      this.logger.log({
        level: 'info',
        message: `${this.constructor.name} begin execution. Task Input: ${JSON.stringify(taskInput)}`,
      });

      // Fetch active seasons from the database
      const activeSeasons = await this.seasonsService.findActiveSeasons();

      if (activeSeasons.length === 0) {
        this.logger.log({
          level: 'info',
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
            level: 'info',
            message: `${this.constructor.name} block height ${taskInput.height} is outside of season ${season._id} block range. Task execution skipped.`,
          });
          continue;
        }
        // Fetch the tasks for this active season
        const tasks = season.tasks;

        // Fetch the target task from the database
        const targetTask = await this.tasksService.findBySeedId(taskType);

        // Search for the taskType to be executed inside the
        // tasks in the active season
        const taskIsInSeason = tasks.some(
          (taskId) => taskId.toString() === targetTask._id.toString(),
        );

        if (!taskIsInSeason) {
          this.logger.log({
            level: 'info',
            message: `${this.constructor.name} task ${taskType} not found in active season. Task execution skipped.`,
          });
          return;
        }

        // Fetch all the users in this season
        const allUsers = await this.usersService.findUsersBySeason(
          new Types.ObjectId(season._id.toString()),
        );
        console.log('allUsers');
        console.log(allUsers);

        //TODO: continue
        // Execute custom task logic from child class
        await callback(taskInput);
      }
    } catch (err) {
      this.logger.error({
        level: 'error',
        message: `${this.constructor.name} error: ${err.message}`,
        error: err,
      });
    }
  }
}
