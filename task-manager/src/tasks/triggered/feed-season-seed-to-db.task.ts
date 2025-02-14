import { Injectable, Logger } from "@nestjs/common";
import { SeasonsService } from "../../collections/seasons/seasons.service";
import { TasksService } from "../../collections/tasks/tasks.service";
import { ConfigHelperService } from "../../config/config-helper.service";

@Injectable()
export class FeedSeasonSeedToDbTask {
  private readonly logger = new Logger(FeedSeasonSeedToDbTask.name);

  constructor(
    private readonly seasonsService: SeasonsService,
    private readonly tasksService: TasksService,
    private readonly configHelperService: ConfigHelperService,
  ) {}

  private async processTasksForSeason(season, existingTasks) {
    const arrOfTaskToSave = [];
    for (const taskId of season.tasks) {
      const taskToSave = existingTasks.find((t) => t.seedId === taskId);
      if (!taskToSave) {
        this.logger.log({
          level: "error",
          message: `FeedSeasonSeedToDbTask task not found: ${taskId}`,
        });
        throw new Error("CRITICAL");
      }
      arrOfTaskToSave.push(taskToSave._id);
    }
    return arrOfTaskToSave;
  }

  private async handleSeasonUpdate(season, existingSeasons, forceUpdate) {
    const seasonToUpdate = existingSeasons.find(
      (s) => s.number === season.number,
    );
    this.logger.log({
      level: "info",
      message: `FeedSeasonSeedToDbTask updating season: ${season.number}. Force flag: ${forceUpdate}`,
    });
    await this.seasonsService.update({ _id: seasonToUpdate._id }, season);
    this.logger.log({
      level: "info",
      message: `FeedSeasonSeedToDbTask updated season: ${season.number}`,
    });
  }

  async execute(...args: any[]) {
    const [forceUpdate, callbackSetPaused] = args;
    try {
      this.logger.log({
        level: "info",
        message: `FeedSeasonSeedToDbTask begin execution. Force flag: ${forceUpdate}`,
      });

      const existingSeasons = await this.seasonsService.findAll();
      const existingTasks = await this.tasksService.findAll();
      const seedSeasons = this.configHelperService.getSeasons();

      for (const season of seedSeasons) {
        const seasonDoesNotExist = !existingSeasons.find(
          (s) => s.number === season.number,
        );

        if (seasonDoesNotExist || forceUpdate) {
          season.tasks = await this.processTasksForSeason(
            season,
            existingTasks,
          );

          if (seasonDoesNotExist) {
            await this.seasonsService.create(season);
            this.logger.log({
              level: "info",
              message: `FeedSeasonSeedToDbTask created season: ${season.number}`,
            });
          } else if (forceUpdate) {
            await this.handleSeasonUpdate(season, existingSeasons, forceUpdate);
          }
        } else {
          this.logger.log({
            level: "info",
            message: `FeedSeasonSeedToDbTask season already exists: ${season.number}`,
          });
        }
      }
      callbackSetPaused(false);
    } catch (err) {
      callbackSetPaused(false);
      this.logger.error({
        level: "error",
        message: `FeedSeasonSeedToDbTask error: ${err.message}`,
        error: err,
      });
      if (err.message === "CRITICAL") throw err;
    }
  }
}
