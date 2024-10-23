import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { SeasonLabel } from "../shared/models/enum/SeasonLabel";
import { seasonsConfig } from "../config/configuration";
import { SeasonDbService } from "../db/services/users-db/season-db.service";
import { formatSeasonDocument } from "../shared/utils/mapper";
import { UsersDbService } from "../db/services/users-db/users-db.service";
import { TaskDbService } from "../db/services/users-db/task-db.service";
import { IconConnectorService } from "../chain-connectors/icon-connector.service";
import { UsersTaskDbService } from "../db/services/users-db/user-task-db.service";
import { RankingService } from "../ranking/service/ranking.service";
import { getRankingOfSeasonReduced } from "../shared/utils/ranking-utils";
import { SeasonDto } from "./dto/season.dto";
import { CalculateSeasonReqDto } from "./dto/calculate-season-req.dto";
import { RewardsDto } from "./dto/rewards.dto";

@Injectable()
export class SeasonService {
  constructor(
    private seasonDb: SeasonDbService,
    private userDb: UsersDbService,
    private taskDb: TaskDbService,
    private iconConnector: IconConnectorService,
    private userTaskDb: UsersTaskDbService,
    private rankingService: RankingService,
  ) {}

  async calculateSeason(
    seasonLabel: SeasonLabel,
    { total, baseline, filter }: CalculateSeasonReqDto,
  ): Promise<RewardsDto[]> {
    const filterData = !filter ? {} : filter;

    const omitFilter = filterData.omit == null ? [] : filterData.omit;
    const seasonDbLabel = seasonsConfig.routes[seasonLabel];
    const rankings = await this.rankingService.getRankingOfSeason(seasonDbLabel);
    const rankingsReduced = getRankingOfSeasonReduced(rankings);
    const rankData = [...rankingsReduced];

    if (!Array.isArray(rankData)) {
      throw new Error("Invalid rankings");
    }

    if (rankData.length === 0 || !rankData.every((obj) => obj && typeof obj === "object" && "total" in obj)) {
      throw new Error("Rank must be an array of objects with at least one key 'total'");
    }

    const totalPoints = rankData.reduce((acc, obj) => {
      if (omitFilter.includes(obj.address)) {
        return acc;
      }
      return acc + obj.total;
    }, 0);

    let participants = 0;
    for (const key in rankData) {
      if (!omitFilter.includes(rankData[key].address)) {
        participants++;
      }
    }

    if (baseline * participants >= total) {
      throw new Error("Baseline is too high");
    }

    const totalWithoutBaseline = total - baseline * participants;

    return rankData.map((obj) => {
      const { total, address } = obj;

      if (omitFilter.includes(address)) {
        return {
          ...obj,
          amount: 0,
        };
      }

      if (total === 0) {
        return {
          ...obj,
          amount: baseline,
        };
      }

      const amount = (total / totalPoints) * totalWithoutBaseline + baseline;

      return {
        ...obj,
        amount: amount,
      };
    });
  }

  async getSeason(seasonLabel: SeasonLabel): Promise<SeasonDto> {
    const seasonDbLabel = seasonsConfig.routes[seasonLabel];

    if (seasonDbLabel == null) {
      throw new Error("Invalid season");
    }

    const season = await this.seasonDb.getSeasonByNumberId(seasonDbLabel);

    if (!season) {
      throw new Error("Season not found");
    }

    const seasonFormatted = formatSeasonDocument(season);

    const users = (await this.userDb.getUsersBySeason(season._id)) ?? [];

    const userCount = users.length;

    let icxBalance = 0;

    const tasks = [];
    for (const task of season.tasks) {
      const taskFromDb = await this.taskDb.getTaskById(task._id);

      if (!taskFromDb) {
        console.error(`Task by ID ${task._id.toString()} not found. Skipping..`);
        continue;
      }

      if (taskFromDb.title === "registration") {
        continue;
      }

      let ammount = 0;
      const formula = new Function(...taskFromDb.rewardFormula);
      const divider = formula(1);
      for (let i = 0; i < userCount; i++) {
        // this will only run once, for the first task
        // that way we dont duplicate the icx balance
        const user = users[i];

        if (tasks.length == 0) {
          icxBalance += (await this.iconConnector.getIcxBalance(user.walletAddress, true)).toNumber();
        }

        const userTask = await this.userTaskDb.getUserTaskByAllIds(user._id, task._id, season._id);

        if (!userTask) {
          continue;
        }

        const lastXp = userTask.xpEarned[userTask.xpEarned.length - 1].xp / divider;

        if (!Number.isNaN(lastXp)) {
          ammount += lastXp;
        }
      }

      tasks.push({
        totalLastDay: ammount,
        description: taskFromDb.description,
        title: taskFromDb.title,
      });
    }

    const rankings = await this.rankingService.getRankingOfSeason(seasonDbLabel);
    const rankingsReduced = getRankingOfSeasonReduced(rankings);

    return {
      number: seasonFormatted.number,
      blockStart: seasonFormatted.blockStart,
      blockEnd: seasonFormatted.blockEnd,
      userCount: userCount,
      balance_in_wallets: {
        icx: icxBalance,
      },
      tasks: tasks,
      rankings: rankingsReduced,
    };
  }

  getTaskBySeason(seasonLabel: SeasonLabel, taskLabel: string): void {
    // TODO implement

    console.log(`seasonLabel=${seasonLabel}, taskLabel=${taskLabel}`);

    throw new InternalServerErrorException({
      error: "Not implemented",
    });
  }
}
