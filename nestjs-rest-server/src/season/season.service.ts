import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { SeasonLabel } from "../shared/models/enum/SeasonLabel";
import { seasonsConfig } from "../config/configuration";
import { SeasonDbService } from "../db/services/season-db.service";
import { formatSeasonDocument } from "../shared/utils/mapper";
import { UsersDbService } from "../db/services/users-db.service";
import { TaskDbService } from "../db/services/task-db.service";
import { IconConnectorService } from "../chain-connectors/icon-connector.service";
import { UsersTaskDbService } from "../db/services/user-task-db.service";
import { RankingService } from "../ranking/service/ranking.service";
import { getRankingOfSeasonReduced } from "../shared/utils/ranking-utils";
import { findTimeGivenBlock } from "../shared/utils/general-util";
import { SeasonDto } from "./dto/season.dto";
import { CalculateSeasonReqDto } from "./dto/calculate-season-req.dto";
import { RewardsDto } from "./dto/rewards.dto";
import { SeasonsDocument } from "../db/schemas/Seasons.schema";

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

    const parsedTotal = parseInt(total);
    const parsedBaseline = parseInt(baseline);

    if (isNaN(parsedTotal) || isNaN(parsedBaseline)) {
      throw new BadRequestException("Invalid total or baseline");
    }

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

    if (parsedBaseline * participants >= parsedTotal) {
      throw new Error("Baseline is too high");
    }

    const totalWithoutBaseline = parsedTotal - parsedBaseline * participants;

    const result = rankData.map((obj) => {
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
          amount: parsedBaseline,
        };
      }

      const multiplier = (total / totalPoints) * totalWithoutBaseline;
      const amount = multiplier + parsedBaseline;

      return {
        ...obj,
        amount: amount,
      };
    });

    return result;
  }

  async getSeasonDocument(seasonLabel: SeasonLabel): Promise<SeasonsDocument> {
    const seasonNumberId = seasonsConfig.routes[seasonLabel];

    if (seasonNumberId == null) {
      throw new BadRequestException("Invalid season label");
    }

    const season = await this.seasonDb.getSeasonByNumberId(seasonNumberId);

    if (!season) {
      throw new NotFoundException("Season not found");
    }

    return season;
  }

  async getSeason(seasonLabel: SeasonLabel): Promise<SeasonDto> {
    const seasonNumberId = seasonsConfig.routes[seasonLabel];

    if (seasonNumberId == null) {
      throw new BadRequestException("Invalid season label");
    }

    const season = await this.seasonDb.getSeasonByNumberId(seasonNumberId);

    if (!season) {
      throw new NotFoundException("Season not found");
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

        const userTasks = await this.userTaskDb.getUserTaskByAllIds(user._id, task._id, season._id);

        if (!userTasks || userTasks.length == 0) {
          continue;
        }

        const lastXp =
          userTasks.reduce((sum, userTask) => sum + userTask.xpEarned[userTask.xpEarned.length - 1].xp, 0) / divider;

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

    const rankings = await this.rankingService.getRankingOfSeason(seasonNumberId);
    const rankingsReduced = getRankingOfSeasonReduced(rankings);

    return {
      number: seasonFormatted.number,
      blockStart: seasonFormatted.blockStart,
      blockEnd: seasonFormatted.blockEnd,
      timeStart: findTimeGivenBlock(seasonFormatted.blockStart),
      timeEnd: findTimeGivenBlock(seasonFormatted.blockEnd),
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
