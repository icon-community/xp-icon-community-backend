import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { seasonsConfig } from "../config/configuration";
import { SeasonLabel } from "../shared/models/enum/SeasonLabel";
import { UsersDbService } from "../db/services/users-db.service";
import { SeasonDbService } from "../db/services/season-db.service";
import { UsersTaskDbService } from "../db/services/user-task-db.service";
import { sha3_256 } from "js-sha3";
import { Types } from "mongoose";
import { TaskDbService } from "../db/services/task-db.service";
import {
  formatMailerliteSubscriber,
  formatSeasonDocument,
  formatUser,
  formatUserDocument,
  formatUserTaskDocuments,
} from "../shared/utils/mapper";
import { calculateTaskTotalXp, sumXp24hrs, sumXpTotal } from "../shared/utils/xp-util";
import { RankingService } from "../ranking/service/ranking.service";
import {
  FormattedUserBySeasonTask,
  FormattedUserSeason,
  FormattedUserTask,
} from "../shared/models/types/FormattedTypes";
import { REFERRAL_CODE_LENGTH } from "../constants";
import { CreateUserDto } from "../db/db-models";
import { MongoDbErrorCode } from "../shared/models/enum/MongoDbErrorCode";
import { ReferralService } from "../referral/referral.service";
import { UserErrorCodes } from "./error/user-error-codes";
import { UserResponseDto } from "./dto/user-response.dto";
import { LinkSocialDataDto } from "./dto/link-social-data.dto";
import { LinkWalletDto } from "./dto/link-wallet.dto";
import { AuthService } from "../auth/auth.service";
import { SeasonErrorCodes } from "./error/season-error-codes";
import { IconConnectorService } from "../chain-connectors/icon-connector.service";
import { UserDocument } from "../db/schemas/User.schema";
import { CreateOrUpdateSubscriberParams, SingleSubscriberResponse } from "@mailerlite/mailerlite-nodejs";
import { UserLinkedSocial } from "./dto/user-linked-socials.dto";
import { AxiosResponse } from "axios";
import { TasksService } from "../tasks/tasks.service";
import { XpgoConfigService } from "../config/xpgo-config.service";
import { retry } from "../shared/utils/general-util";
import { MaileriteSubscriberDto } from "./dto/mailerite-subscriber.dto";

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
    private authService: AuthService,
    private iconConnector: IconConnectorService,
    private taskService: TasksService,
    private config: XpgoConfigService,
  ) {}

  async getUser(address: string): Promise<UserResponseDto> {
    const user = await this.userDb.getUserByAddress(address);

    if (!user) {
      throw new NotFoundException(UserErrorCodes.USER_NOT_FOUND);
    }

    return formatUser(user);
  }

  async linkUserSocial(socialData: LinkSocialDataDto, address: string): Promise<UserResponseDto | HttpException> {
    try {
      const updatedUser = await this.userDb.linkUserSocial(socialData, address);

      if (!updatedUser) {
        return new BadRequestException("User not found or social already linked");
      }

      try {
        // try issue XP immediately
        await retry(() => this.taskService.issueLinkSocialXp(socialData.seasonLabel, socialData.provider, address));
      } catch (e) {
        this.logger.error(JSON.stringify(e, null, 2));
        this.logger.error(
          `Failed issueLinkSocialXp for address${address}, season=${socialData.seasonLabel}, provider=${socialData.provider}`,
        );
      }

      return formatUser(updatedUser);
    } catch (e: unknown) {
      console.error(e);
      throw new InternalServerErrorException("Failed to link user social");
    }
  }

  async linkUserWallet(linkWalletDto: LinkWalletDto, address: string): Promise<UserResponseDto | HttpException> {
    try {
      const authData = await this.authService.authenticateUser(linkWalletDto.accessToken);

      if (authData.publicAddress != linkWalletDto.address) {
        return new BadRequestException("Invalid accessToken for given address");
      }

      const updatedUser = await this.userDb.linkUserWallet(linkWalletDto, address);

      if (!updatedUser) {
        return new BadRequestException("User not found or social already linked");
      }

      return formatUser(updatedUser);
    } catch {
      return new InternalServerErrorException("Failed to link user social");
    }
  }

  async getUserBySeason(userWallet: string, seasonLabel: SeasonLabel): Promise<FormattedUserSeason | HttpException> {
    const seasonDbLabel = seasonsConfig.routes[seasonLabel];

    if (!seasonDbLabel) {
      throw new Error("Invalid season");
    }

    const user = await this.userDb.getUserByAddress(userWallet);
    const formattedUser = formatUserDocument(user);

    if (!user || !formattedUser) {
      throw new BadRequestException(UserErrorCodes.USER_NOT_FOUND);
    }

    // from the user data fetch the seasons that the
    // user is registered in
    const userSeasons = user.seasons;

    // fetch the season by the provided season label
    const season = await this.seasonDb.getSeasonByNumberId(seasonDbLabel);

    // if the season is not found, throw an error
    if (!season) {
      throw new BadRequestException(SeasonErrorCodes.SEASON_NOT_FOUND);
    }

    // verify that the user is registered in the season
    // by checking if the id of season is inside the
    // userSeasons array
    let flag = false;
    userSeasons.forEach((registeredSeasons) => {
      if (registeredSeasons.seasonId.equals(season._id)) {
        flag = true;
      }
    });

    if (flag === false) {
      throw new BadRequestException(SeasonErrorCodes.SEASON_NOT_REGISTERED);
    }

    const formattedSeason = formatSeasonDocument(season);

    const seasonTasks = (await this.taskDb.getTasksByIds(season.tasks)) ?? [];

    const tasks: FormattedUserBySeasonTask[] = [];
    const userAboveTasks = [];
    const userBelowTasks = [];

    const rankings = await this.rankingService.getRankingOfSeason(seasonDbLabel);

    const thisUserIndex = rankings.findIndex((userIndex) => userIndex._id.equals(user._id));
    const userAbove = thisUserIndex - 1 < 0 ? null : rankings[thisUserIndex - 1].address;
    const userBelow = thisUserIndex + 1 >= rankings.length ? null : rankings[thisUserIndex + 1].address;

    for (let i = 0; i < seasonTasks.length; i++) {
      const taskFromDb = seasonTasks[i];

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

      const userTasks = formatUserTaskDocuments(
        await this.userTaskDb.getUserTaskByAllIds(user._id, season.tasks[i]._id, season._id),
      );

      if (userTasks == null || userTasks.length == 0) {
        continue;
      }

      const taskTotalXp = calculateTaskTotalXp(userTasks);
      const xp = {
        status: userTasks[0].status,
        xpEarned: userTasks.map((task) => task.xpEarned).flat(),
      } satisfies FormattedUserTask;

      tasks.push({
        task: {
          ...taskFromDb,
          XPEarned_total_task: taskTotalXp,
        },
        xp,
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
    const userTasks = await this.userTaskDb.getUserTaskByAllIds(userId, taskId, seasonId);

    if (userTasks == null || userTasks.length == 0) {
      return 0;
    }

    return calculateTaskTotalXp(userTasks);
  }

  async getUserReferralCode(publicAddress: string): Promise<string> {
    const referralCode = await this.userDb.getUserReferralCode(publicAddress);

    if (!referralCode) {
      throw new NotFoundException(UserErrorCodes.USER_NOT_FOUND);
    }

    return referralCode;
  }

  async registerUser(publicAddress: string, referralCode?: string): Promise<UserResponseDto> {
    try {
      const createUserDto: CreateUserDto = {
        walletAddress: publicAddress,
        seasons: [],
        referralCode: this.generateReferralCode(publicAddress),
      };

      const rawUser = await this.userDb.createUser(createUserDto);

      // handle referral after user creation
      if (referralCode) {
        try {
          await this.referralService.createUserReferral(referralCode, publicAddress, rawUser._id);
        } catch {
          // gracefully log an error but do not throw
          this.logger.error("Failed to create referral");
        }
      }
      return formatUser(rawUser);
    } catch (e) {
      if (e?.code === MongoDbErrorCode.DUPLICATE) {
        throw new BadRequestException(UserErrorCodes.USER_ALREADY_EXISTS);
      }

      this.logger.error(`Failed to register user: ${JSON.stringify(e, null, 2)}`);
      throw new InternalServerErrorException(UserErrorCodes.REGISTRATION_FAILED);
    }
  }

  async registerSeason(publicAddress: string, seasonLabel: SeasonLabel): Promise<UserResponseDto> {
    try {
      // find season by SeasonLabel
      const seasonDbLabel = seasonsConfig.routes[seasonLabel];

      if (!seasonDbLabel) {
        throw new Error("Invalid season");
      }

      const season = await this.seasonDb.getSeasonByNumberId(seasonDbLabel);

      if (!season) {
        throw new BadRequestException(SeasonErrorCodes.SEASON_NOT_FOUND);
      }

      // fetch current block height on ICON chain
      const latestBlock = await this.iconConnector.getLastBlock();

      if (!latestBlock) {
        throw new InternalServerErrorException("Failed to fetch latest block");
      }

      if (!("height" in latestBlock)) {
        throw new InternalServerErrorException("Failed to fetch latest block height");
      }

      // add season to user
      const newSeason: { seasonId: any; registrationBlock: any } = {
        seasonId: season._id,
        registrationBlock: latestBlock.height,
      };
      const result = await this.userDb.addSeasonToUser(publicAddress, newSeason);

      if (result == null) {
        throw new BadRequestException(UserErrorCodes.ADDING_SEASON_FAILED);
      }
      return formatUser(result);
    } catch (e) {
      if (e?.code === MongoDbErrorCode.DUPLICATE) {
        throw new BadRequestException(UserErrorCodes.USER_ALREADY_EXISTS);
      }

      this.logger.error(`Failed to add season to user: ${JSON.stringify(e, null, 2)}`);
      throw new InternalServerErrorException(UserErrorCodes.REGISTRATION_FAILED);
    }
  }

  async getMailerLiteSubscriber(email: string, publicAddress: string): Promise<MaileriteSubscriberDto> {
    let user: UserDocument | null = null;

    try {
      user = await this.userDb.getUserByAddress(publicAddress);
    } catch (e) {
      this.logger.error(`Failed to fetch user from db: ${JSON.stringify(e, null, 2)}`);
      throw new InternalServerErrorException(UserErrorCodes.FAILED_TO_RETRIEVE_USER);
    }

    if (!user) {
      throw new NotFoundException(UserErrorCodes.USER_NOT_FOUND);
    }

    const social: UserLinkedSocial | undefined = user.linkedSocials.find((v) => v.email === email);

    if (!social) {
      throw new BadRequestException("Linked social not found for given email");
    }

    if (!social.email) {
      throw new BadRequestException(`Email undefined`);
    }

    try {
      const response: AxiosResponse<SingleSubscriberResponse> = await this.config.mailerlite.subscribers.find(email);

      if (response.status < 300) {
        if (response.data.data.groups?.some((v) => v.id === this.config.mailerliteGroupId)) {
          return formatMailerliteSubscriber(response.data.data);
        } else {
          throw new NotFoundException(`Email ${email} not found`);
        }
      } else {
        throw new Error(JSON.stringify(response.data.data));
      }
    } catch (e: any) {
      if (e?.response?.status === 404) {
        throw new NotFoundException(`Email ${email} not found`);
      } else if (e instanceof NotFoundException) {
        throw e;
      }

      this.logger.error(`Failed to get Mailerlite Subscriber: ${JSON.stringify(e, null, 2)}`);
      throw new InternalServerErrorException(`Failed to get Mailerlite Subscriber`);
    }
  }

  async subscribeUserToMailerLite(
    seasonLabel: SeasonLabel,
    email: string,
    publicAddress: string,
  ): Promise<MaileriteSubscriberDto> {
    const user: UserDocument | null = await this.userDb.getUserByAddress(publicAddress);

    if (!user) {
      throw new NotFoundException(UserErrorCodes.USER_NOT_FOUND);
    }

    const social: UserLinkedSocial | undefined = user.linkedSocials.find((v) => v.email === email);

    if (!social) {
      throw new BadRequestException("Linked social not found for given email");
    }

    if (!social.email) {
      throw new BadRequestException(`Email undefined`);
    }

    const params = {
      email: social.email,
      fields: {},
      groups: [this.config.mailerliteGroupId],
      status: "active",
      subscribed_at: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
    } satisfies CreateOrUpdateSubscriberParams;

    const response: AxiosResponse<SingleSubscriberResponse, CreateOrUpdateSubscriberParams> =
      await this.config.mailerlite.subscribers.createOrUpdate(params);

    if (response.status > 300) {
      throw new InternalServerErrorException(
        `Error occurred while creating Mailerlite Subscriber. Details: ${JSON.stringify(response.data)}`,
      );
    }

    this.logger.log(`Successfully subscribed ${email} in season ${seasonLabel} of user ${user._id}`);

    try {
      // try issue XP immediately
      await retry(() => this.taskService.issueHanaNewsletterSubscriptionXp(seasonLabel, email, publicAddress, user));
    } catch (e) {
      this.logger.error(JSON.stringify(e, null, 2));
      this.logger.error(
        `Failed issueHanaNewsletterSubscriptionXp for user${user._id.toString()}, season=${seasonLabel}, email=${email}`,
      );
    }

    return formatMailerliteSubscriber(response.data.data);
  }

  private generateReferralCode(publicAddress: string): string {
    return `${sha3_256(publicAddress).slice(0, REFERRAL_CODE_LENGTH)}`;
  }
}
