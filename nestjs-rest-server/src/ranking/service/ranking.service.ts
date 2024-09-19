import { Injectable } from "@nestjs/common";
import { UsersDbService } from "../../db/services/users-db/users-db.service";
import { SeasonDbService } from "../../db/services/users-db/season-db.service";
import { UsersTaskDbService } from "../../db/services/users-db/user-task-db.service";
import { TaskDbService } from "../../db/services/users-db/task-db.service";
import { RankData, TaskXp } from "../../shared/models/types/RankedTypes";

@Injectable()
export class RankingService {
  constructor(
    private userDb: UsersDbService,
    private seasonDb: SeasonDbService,
    private userTaskDb: UsersTaskDbService,
    private taskDb: TaskDbService,
  ) {}

  public async getRankingOfSeason(seasonNumber: number): Promise<RankData[]> {
    const season = await this.seasonDb.getSeasonByNumberId(seasonNumber);

    if (!season) {
      throw new Error("Season not found");
    }

    const allUsers = (await this.userDb.getUsersBySeason(season.id)) ?? [];
    const ranked = [];

    for (let i = 0; i < allUsers.length; i++) {
      const tempData: RankData = {
        _id: allUsers[i]._id,
        address: allUsers[i].walletAddress,
        total: 0,
        tasks: [] as TaskXp[],
      };

      for (let ii = 0; ii < season.tasks.length; ii++) {
        const userTask = await this.userTaskDb.getUserTaskByAllIds(allUsers[i]._id, season.tasks[ii], season._id);

        if (!userTask) {
          continue;
        }

        const taskTotalXp = userTask.xpEarned.reduce((a, b) => a + Number(b.xp), 0);

        tempData.total = tempData.total + taskTotalXp;
        tempData.tasks.push({
          task: season.tasks[ii]._id,
          xp: taskTotalXp,
        });
      }
      ranked.push(tempData);
    }

    ranked.sort((a, b) => b.total - a.total);

    return ranked;
  }
}
