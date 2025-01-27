import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { SeasonsService } from '../../collections/seasons/seasons.service';
import { TasksService } from '../../collections/tasks/tasks.service';
import { ConfigHelperService } from '../../config/config-helper.service';

@Injectable()
export class FeedSeasonSeedToDbTask {
  private readonly logger = new Logger(FeedSeasonSeedToDbTask.name);

  constructor(
    private readonly seasonsService: SeasonsService,
    private readonly tasksService: TasksService,
    private readonly configHelperService: ConfigHelperService,
  ) {}

  async execute(...args) {
    const [forceUpdate, callbackSetPaused] = args;
    try {
      this.logger.log({
        level: 'info',
        message: `FeedSeasonSeedToDbTask begin execution. Force flag: ${forceUpdate}`,
      });

      // fetch all existing seasons
      const existingSeasons = await this.seasonsService.findAll();

      // fetch all existing tasks
      const existingTasks = await this.tasksService.findAll();

      // fetch seasons from seed file
      const seedSeasons = this.configHelperService.getSeasons();

      // compare seasons in seed file to seasons in db
      for (const season of seedSeasons) {
        const seasonDoesNotExist = !existingSeasons.find(
          (s) => s.number === season.number,
        );

        if (seasonDoesNotExist || forceUpdate) {
          const arrOfTaskToSave = [];

          for (const taskId of season.tasks) {
            const taskToSave = existingTasks.find((t) => t.seedId === taskId);

            if (taskToSave) {
              arrOfTaskToSave.push(taskToSave._id);
            } else {
              this.logger.log({
                level: 'error',
                message: `FeedSeasonSeedToDbTask task not found: ${taskId}`,
              });

              // it should not happen that no task is
              // found, the logic of the code should
              // seed the tasks before seeding the seasons
              // if this happens it is a CRITICAL error
              // in the logic and it needs to be fixed
              throw new Error('CRITICAL');
            }
          }
          season.tasks = [...arrOfTaskToSave];

          if (seasonDoesNotExist) {
            await this.seasonsService.create(season);
            this.logger.log({
              level: 'info',
              message: `FeedSeasonSeedToDbTask created season: ${season.number}`,
            });
          }
        } else {
          this.logger.log({
            level: 'info',
            message: `FeedSeasonSeedToDbTask season already exists: ${season.number}`,
          });

          if (forceUpdate) {
            this.logger.log({
              level: 'info',
              message: `FeedSeasonSeedToDbTask updating season: ${season.number}. Force flag: ${forceUpdate}`,
            });
            const seasonToUpdate = existingSeasons.find(
              (s) => s.number === season.number,
            );

            this.seasonsService.update({ _id: seasonToUpdate._id }, season);
            this.logger.log({
              level: 'info',
              message: `FeedSeasonSeedToDbTask updated season: ${season.number}`,
            });
          }
        }
      }
      callbackSetPaused(false);
    } catch (err) {
      callbackSetPaused(false);
      this.logger.error({
        level: 'error',
        message: `FeedSeasonSeedToDbTask error: ${err.message}`,
        error: err,
      });

      if (err.message === 'CRITICAL') {
        throw new Error('CRITICAL');
      }
    }
  }
}
