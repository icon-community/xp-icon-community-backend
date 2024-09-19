import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { seasonsConfig } from "../config/configuration";
import { SeasonLabel } from "../shared/models/enum/SeasonLabel";
import { UsersDbService } from "../db/services/users-db/users-db.service";
import { SeasonDbService } from "../db/services/users-db/season-db.service";
import { UsersTaskDbService } from "../db/services/users-db/user-task-db.service";
import { Types } from "mongoose";
import { TaskDbService } from "../db/services/users-db/task-db.service";
import {
  formatSeasonDocument,
  formatTaskDocument,
  formatUserDocument,
  formatUserTaskDocument,
} from "../shared/utils/mapper";
import { sumXp24hrs, sumXpTotal } from "../shared/utils/xp-util";
import { RankingService } from "../ranking/service/ranking.service";
import { FormattedUserBySeasonTask, FormattedUserSeason } from "../shared/models/types/FormattedTypes";

@Injectable()
export class UserService {
  constructor(
    private userDb: UsersDbService,
    private seasonDb: SeasonDbService,
    private userTaskDb: UsersTaskDbService,
    private taskDb: TaskDbService,
    private rankingService: RankingService,
  ) {}

  getUserAllSeasons(): InternalServerErrorException {
    return new InternalServerErrorException({
      message: "Not implemented",
    });
  }

  async getUserBySeason(userWallet: string, seasonLabel: SeasonLabel): Promise<FormattedUserSeason> {
    const seasonDbLabel = seasonsConfig.routes[seasonLabel];

    if (!seasonDbLabel) {
      throw new Error("Invalid season");
    }

    const user = await this.userDb.getUserByAddress(userWallet);
    const formattedUser = formatUserDocument(user);

    if (!user) {
      throw new Error("User not found");
    }

    const season = await this.seasonDb.getSeasonByNumberId(seasonDbLabel);
    const formattedSeason = formatSeasonDocument(season);

    if (!season || !formattedSeason) {
      throw new Error("Season not found");
    }

    const tasks: FormattedUserBySeasonTask[] = [];
    const userAboveTasks = [];
    const userBelowTasks = [];

    const rankings = await this.rankingService.getRankingOfSeason(seasonDbLabel);

    const thisUserIndex = rankings.findIndex((userIndex) => userIndex._id.equals(user._id));
    const userAbove = thisUserIndex - 1 < 0 ? null : rankings[thisUserIndex - 1].address;
    const userBelow = thisUserIndex + 1 >= rankings.length ? null : rankings[thisUserIndex + 1].address;

    for (let i = 0; i < season.tasks.length; i++) {
      const taskFromDb = formatTaskDocument(await this.taskDb.getTaskById(season.tasks[i]._id));

      if (taskFromDb == null) {
        console.log("Task not found");
        continue;
      }

      if (userAbove != null) {
        const totalXp = await this.getTaskTotalXp(rankings[thisUserIndex - 1]._id, season.tasks[i]._id, season._id);
        userAboveTasks.push({
          task: {
            XPEarned_total_task: totalXp,
          },
        });
      }

      if (userBelow != null) {
        const totalXp = await this.getTaskTotalXp(rankings[thisUserIndex + 1]._id, season.tasks[i]._id, season._id);
        userBelowTasks.push({
          task: {
            XPEarned_total_task: totalXp,
          },
        });
      }

      const userTask = formatUserTaskDocument(
        await this.userTaskDb.getUserTaskByAllIds(user._id, season.tasks[i]._id, season._id),
      );

      if (userTask == null) {
        console.log("User task not found");
        continue;
      }

      const taskTotalXp = userTask.xpEarned.reduce((a, b) => a + Number(b.xp), 0);

      tasks.push({
        task: {
          ...taskFromDb,
          XPEarned_total_task: taskTotalXp,
        },
        xp: userTask,
      });
    }

    return {
      user: formattedUser,
      season: {
        ...formattedSeason,
        Rank: thisUserIndex + 1,
        Address_above: userAbove,
        Address_below: userBelow,
        Address_above_XP: sumXpTotal(userAboveTasks),
        Address_below_XP: sumXpTotal(userBelowTasks),
        XPEarned_total: sumXpTotal(tasks),
        XPEarned_24hrs: sumXp24hrs(tasks),
        tasks: tasks,
      },
    };
  }

  async getTaskTotalXp(userId: Types.ObjectId, taskId: Types.ObjectId, seasonId: Types.ObjectId): Promise<number> {
    const userTask = await this.userTaskDb.getUserTaskByAllIds(userId, taskId, seasonId);

    if (userTask == null) {
      return 0;
    }

    return userTask.xpEarned.reduce((a, b) => a + Number(b.xp), 0);
  }
}
