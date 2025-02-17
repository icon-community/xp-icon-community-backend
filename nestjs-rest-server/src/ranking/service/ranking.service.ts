import { Inject, Injectable } from "@nestjs/common";
import { UsersDbService } from "../../db/services/users-db.service";
import { SeasonDbService } from "../../db/services/season-db.service";
import { UsersTaskDbService } from "../../db/services/user-task-db.service";
import { RankDataPlain } from "../../shared/models/types/RankedTypes";
import { calculateTaskTotalXp } from "../../shared/utils/xp-util";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { RANKINGS_DEFAULT_CACHE_MS } from "../../constants";
import { UserTaskDocument } from "../../db/schemas/UserTask.schema";

@Injectable()
export class RankingService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private userDb: UsersDbService,
    private seasonDb: SeasonDbService,
    private userTaskDb: UsersTaskDbService,
  ) {}

  public async getRankingOfSeason(seasonNumber: number): Promise<RankDataPlain[]> {
    const cacheKey = `getRankingOfSeason-${seasonNumber}`;
    const value = await this.cacheManager.get<RankDataPlain[]>(cacheKey);

    if (value) {
      // return cached value if exists
      return value;
    }

    const season = await this.seasonDb.getSeasonByNumberId(seasonNumber);

    if (!season) {
      throw new Error("Season not found");
    }

    const allUsers = (await this.userDb.getUsersBySeason(season.id)) ?? [];
    const ranked: RankDataPlain[] = [];

    for (const user of allUsers) {
      const tempData: RankDataPlain = {
        _id: user._id.toString(),
        address: user.walletAddress,
        total: 0,
        tasks: [],
      };

      const userTasksResults: Array<UserTaskDocument[] | null> = await Promise.all(
        season.tasks.map((seasonTask) => this.userTaskDb.getUserTaskByAllIds(user._id, seasonTask, season._id)),
      );

      for (let ii = 0; ii < userTasksResults.length; ii++) {
        const userTasks = userTasksResults[ii];

        if (!userTasks || userTasks.length == 0) {
          continue;
        }

        const taskTotalXp = calculateTaskTotalXp(userTasks);

        tempData.total = tempData.total + taskTotalXp;
        tempData.tasks.push({
          task: season.tasks[ii]._id.toString(),
          xp: taskTotalXp,
        });
      }

      ranked.push(tempData);
    }

    ranked.sort((a, b) => b.total - a.total);

    // cache before returning
    await this.cacheManager.set(cacheKey, ranked, RANKINGS_DEFAULT_CACHE_MS);

    return ranked;
  }
}
