import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { seasonsConfig } from "../config/configuration";
import { SeasonLabel } from "../shared/models/enum/SeasonLabel";
import { UsersDbService } from "../db/services/users-db/users-db.service";
import { SeasonDbService } from "../db/services/users-db/season-db.service";
import { UsersTaskDbService } from "../db/services/users-db/user-task-db.service";
import { sha3_256 } from "js-sha3";
import { Types } from "mongoose";
import { TaskDbService } from "../db/services/users-db/task-db.service";
import {
  formatSeasonDocument,
  formatTaskDocument,
  formatUser,
  formatUserDocument,
  formatUserTaskDocument,
} from "../shared/utils/mapper";
import { sumXp24hrs, sumXpTotal } from "../shared/utils/xp-util";
import { RankingService } from "../ranking/service/ranking.service";
import { FormattedUserBySeasonTask, FormattedUserSeason } from "../shared/models/types/FormattedTypes";
import { REFERRAL_CODE_LENGTH } from "../constants";
import { CreateUserDto } from "../db/db-models";
import { MongoDbErrorCode } from "../shared/models/enum/MongoDbErrorCode";
import { ReferralService } from "../referral/referral.service";
import { UserDto } from "./dto/user.dto";
import { UserErrorCodes } from "./error/user-error-codes";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private userDb: UsersDbService,
    private seasonDb: SeasonDbService,
    private userTaskDb: UsersTaskDbService,
    private taskDb: TaskDbService,
    private rankingService: RankingService,
    private referralService: ReferralService,
  ) {}

  async getUser(address: string): Promise<UserDto> {
    const user = await this.userDb.getUserByAddress(address);

    if (!user) {
      throw new NotFoundException(UserErrorCodes.USER_NOT_FOUND);
    }

    return formatUser(user);
  }

  async getUserBySeason(userWallet: string, seasonLabel: SeasonLabel): Promise<FormattedUserSeason> {
    const seasonDbLabel = seasonsConfig.routes[seasonLabel];

    if (!seasonDbLabel) {
      throw new Error("Invalid season");
    }

    const user = await this.userDb.getUserByAddress(userWallet);
    const formattedUser = formatUserDocument(user);

    if (!user) {
      throw new Error(UserErrorCodes.USER_NOT_FOUND);
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

  async getUserReferralCode(publicAddress: string): Promise<string> {
    const referralCode = await this.userDb.getUserReferralCode(publicAddress);

    if (!referralCode) {
      throw new NotFoundException(UserErrorCodes.USER_NOT_FOUND);
    }

    return referralCode;
  }

  async registerUser(publicAddress: string, referralCode?: string): Promise<void> {
    // handle referral first
    if (referralCode) {
      // find referrer user
      const referrerUser = await this.userDb.getUsersByReferralCode(referralCode);

      if (!referrerUser) {
        throw new BadRequestException(`Failed to find referral user for ${referralCode} code.`);
      }

      try {
        await this.referralService.createReferral({
          referrerUserAddress: referrerUser.walletAddress,
          referralCode: referralCode,
          referredUserAddress: publicAddress,
        });
      } catch {
        throw new InternalServerErrorException("Failed to create referral");
      }
    }

    try {
      const createUserDto: CreateUserDto = {
        walletAddress: publicAddress,
        seasons: [],
        referralCode: this.generateReferralCode(publicAddress),
      };

      await this.userDb.createUser(createUserDto);
    } catch (e) {
      if (e?.code === MongoDbErrorCode.DUPLICATE) {
        throw new BadRequestException(UserErrorCodes.USER_ALREADY_EXISTS);
      }

      this.logger.error(`Failed to register user: ${JSON.stringify(e, null, 2)}`);
      throw new InternalServerErrorException(UserErrorCodes.REGISTRATION_FAILED);
    }
  }

  private generateReferralCode(publicAddress: string): string {
    return `${sha3_256(publicAddress.toLowerCase()).slice(0, REFERRAL_CODE_LENGTH)}`;
  }
}
