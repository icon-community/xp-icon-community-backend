import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { SeasonService } from "../season/season.service";
import { SeasonLabel } from "../shared/models/enum/SeasonLabel";
import { TaskDbService } from "../db/services/task-db.service";
import { UsersTaskDbService } from "../db/services/user-task-db.service";
import { UserDocument } from "../db/schemas/User.schema";
import { TaskConfig, TaskLabel, tasks } from "./tasks.config";
import {
  HanaNewsletterXpDetails,
  IXpEarned,
  LinkSocialXpDetails,
  UserTaskDocument,
} from "../db/schemas/UserTask.schema";
import { isHanaNewsletterXpDetails, isLinkSocialXpDetails } from "../shared/type.guards";
import { Status } from "../shared/models/enum/Status";
import { UsersDbService } from "../db/services/users-db.service";
import { SocialProvider } from "../shared/models/enum/SocialProvider";
import { CanClaimTaskDto } from "./dto/can-claim-task.dto";
import { mapProviderToSocialTask } from "../shared/utils/mapper";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private seasonService: SeasonService,
    private taskDbService: TaskDbService,
    private userTaskDbService: UsersTaskDbService,
    private userDb: UsersDbService,
  ) {}

  async canClaimLinkSocialXp(
    seasonLabel: SeasonLabel,
    taskLabel: TaskLabel,
    provider: SocialProvider,
    address: string,
  ): Promise<CanClaimTaskDto> {
    const [season, task] = await Promise.allSettled([
      this.seasonService.getSeasonDocument(seasonLabel),
      this.taskDbService.getTaskBySeedId(taskLabel),
    ]);

    if (season.status === "rejected" || !season.value) {
      throw new NotFoundException(`Season ${seasonLabel} not found`);
    } else if (task.status === "rejected" || !task.value) {
      throw new InternalServerErrorException(`Task with seedId ${taskLabel} not found`);
    }

    const user = await this.userDb.getUserByAddress(address);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const userTask = await this.userTaskDbService.getUserTaskByAllIds(user._id, task.value._id, season.value._id);

    // task exists
    if (userTask && userTask.length > 0) {
      const linkSocialTask: UserTaskDocument = userTask[0];

      // check if xp was already issued for given provider
      for (const xpEarned of linkSocialTask.xpEarned) {
        const details = xpEarned.details;

        if (isLinkSocialXpDetails(details) && details.provider.toLowerCase() === provider.toLowerCase()) {
          // xp was issued
          return {
            claimable: false,
          };
        } else {
          this.logger.error("xpEarned not type of isLinkSocialXpDetails");
        }
      }
    }

    return {
      claimable: true,
    };
  }

  async issueLinkSocialXp(seasonLabel: SeasonLabel, provider: SocialProvider, address: string): Promise<void> {
    const taskLabel: TaskLabel = mapProviderToSocialTask(provider);
    const taskConfig: TaskConfig = tasks[taskLabel];

    const [season, task, user] = await Promise.allSettled([
      this.seasonService.getSeasonDocument(seasonLabel),
      this.taskDbService.getTaskBySeedId(taskLabel),
      this.userDb.getUserByAddress(address),
    ]);

    if (season.status === "rejected" || !season.value) {
      throw new NotFoundException(`Season ${seasonLabel} not found`);
    } else if (task.status === "rejected" || !task.value) {
      throw new InternalServerErrorException(`Task with seedId ${taskLabel} not found`);
    } else if (user.status === "rejected" || !user.value) {
      throw new InternalServerErrorException(`User not found`);
    }

    const rewardFormula: () => number = new Function(...taskConfig.rewardFormula) as () => number;

    const xp = {
      period: 0,
      block: 0,
      xp: rewardFormula(),
      details: {
        provider: provider,
        seasonLabel: seasonLabel,
        issuedAt: new Date(),
      } satisfies LinkSocialXpDetails,
    } satisfies IXpEarned;

    const userTask = await this.userTaskDbService.getUserTaskByAllIds(user.value._id, task.value._id, season.value._id);

    // task exists
    if (userTask && userTask.length > 0) {
      const linkSocialTask: UserTaskDocument = userTask[0];

      // check if xp was already issued for given provider
      for (const xpEarned of linkSocialTask.xpEarned) {
        const details = xpEarned.details;

        if (isLinkSocialXpDetails(details) && details.provider.toLowerCase() === provider.toLowerCase()) {
          // xp was issued, log and return response
          this.logger.warn(`Xp already issued for provider=${provider} of user ${user.value._id.toString()}`);
          throw new BadRequestException(
            `Xp already issued for provider=${provider} of user ${user.value._id.toString()}`,
          );
        } else {
          this.logger.error("xpEarned not type of isLinkSocialXpDetails");
        }
      }

      // push and save xp
      linkSocialTask.xpEarned.push(xp);

      try {
        await this.userTaskDbService.updateOrCreateUserTask(
          {
            userId: user.value._id,
            seasonId: season.value._id,
            taskId: task.value._id,
          },
          linkSocialTask,
        );
        this.logger.log(
          `Issued link social xp for address=${address}, seasonLabel=${seasonLabel}, provider=${provider}`,
        );
      } catch (e: unknown) {
        this.logger.error(`Saving task failed. Failed xp object: ${JSON.stringify(xp, null, 2)}`);
        this.logger.error(JSON.stringify(e, null, 2));
      }
    } else {
      // create user task anew
      try {
        await this.userTaskDbService.createUserTask({
          userId: user.value._id,
          taskId: task.value._id,
          seasonId: season.value._id,
          status: Status.PENDING,
          walletAddress: user.value.walletAddress,
          xpEarned: [xp],
          createdAt: new Date(),
        });
      } catch (e: unknown) {
        this.logger.error(`Saving task failed. Failed xp object: ${JSON.stringify(xp, null, 2)}`);
        this.logger.error(JSON.stringify(e, null, 2));
      }
    }
  }

  async canClaimHanaNewsletterSubscriptionXp(
    seasonLabel: SeasonLabel,
    email: string,
    address: string,
  ): Promise<CanClaimTaskDto> {
    const [season, task, user] = await Promise.allSettled([
      this.seasonService.getSeasonDocument(seasonLabel),
      this.taskDbService.getTaskBySeedId(TaskLabel.HANA_NEWSLETTER),
      this.userDb.getUserByAddress(address),
    ]);

    if (season.status === "rejected" || !season.value) {
      throw new NotFoundException(`Season ${seasonLabel} not found`);
    } else if (task.status === "rejected" || !task.value) {
      throw new InternalServerErrorException(`Task with seedId ${TaskLabel.HANA_NEWSLETTER} not found`);
    } else if (user.status === "rejected" || !user.value) {
      throw new InternalServerErrorException(`User not found`);
    }

    const userTask = await this.userTaskDbService.getUserTaskByAllIds(user.value._id, task.value._id, season.value._id);

    // task exists
    if (userTask && userTask.length > 0) {
      const linkSocialTask: UserTaskDocument = userTask[0];

      // check if xp was already issued for given provider
      for (const xpEarned of linkSocialTask.xpEarned) {
        const details = xpEarned.details;

        if (isHanaNewsletterXpDetails(details) && details.email.toLowerCase() === email.toLowerCase()) {
          // xp was issued
          return {
            claimable: false,
          };
        } else {
          this.logger.error("xpEarned not type of isHanaNewsletterXpDetails");
        }
      }
    }

    return {
      claimable: true,
    };
  }

  async issueHanaNewsletterSubscriptionXp(
    seasonLabel: SeasonLabel,
    email: string,
    address: string,
    user?: UserDocument | null,
  ): Promise<void> {
    const taskConfig = tasks.HANA_NEWSLETTER;

    const [season, task] = await Promise.allSettled([
      this.seasonService.getSeasonDocument(seasonLabel),
      this.taskDbService.getTaskBySeedId(TaskLabel.HANA_NEWSLETTER),
    ]);

    if (season.status === "rejected" || !season.value) {
      throw new NotFoundException(`Season ${seasonLabel} not found`);
    } else if (task.status === "rejected" || !task.value) {
      throw new InternalServerErrorException(`Task with seedId ${TaskLabel.HANA_NEWSLETTER} not found`);
    }

    const rewardFormula: () => number = new Function(...taskConfig.rewardFormula) as () => number;

    const xp = {
      period: 0,
      block: 0,
      xp: rewardFormula(),
      details: {
        email: email,
        issuedAt: new Date(),
      } satisfies HanaNewsletterXpDetails,
    } satisfies IXpEarned;

    if (!user) {
      user = await this.userDb.getUserByAddress(address);

      if (!user) {
        throw new NotFoundException("User not found");
      }
    }

    const userTask = await this.userTaskDbService.getUserTaskByAllIds(user._id, task.value._id, season.value._id);

    // task exists
    if (userTask && userTask.length > 0) {
      const hanaNewsLetterTask: UserTaskDocument = userTask[0];

      // check if xp was already issued for given email
      for (const xpEarned of hanaNewsLetterTask.xpEarned) {
        const details = xpEarned.details;

        if (isHanaNewsletterXpDetails(details) && details.email.toLowerCase() === email.toLowerCase()) {
          // xp was issued, log and return response
          this.logger.warn(`Xp already issued for email=${email} of user ${user._id.toString()}`);
          return;
        } else {
          this.logger.error("xpEarned not type of isHanaNewsletterXpDetails");
        }
      }

      // push and save xp
      hanaNewsLetterTask.xpEarned.push(xp);

      try {
        await this.userTaskDbService.updateOrCreateUserTask(
          {
            userId: user._id,
            seasonId: season.value._id,
            taskId: task.value._id,
          },
          hanaNewsLetterTask,
        );
        this.logger.log(`Issued link social xp for address=${address}, seasonLabel=${seasonLabel}, email=${email}`);
      } catch (e: unknown) {
        this.logger.error(`Saving task failed. Failed xp object: ${JSON.stringify(xp, null, 2)}`);
        this.logger.error(JSON.stringify(e, null, 2));
      }
    } else {
      // create user task anew
      try {
        await this.userTaskDbService.createUserTask({
          userId: user._id,
          taskId: task.value._id,
          seasonId: season.value._id,
          status: Status.PENDING,
          walletAddress: user.walletAddress,
          xpEarned: [xp],
          createdAt: new Date(),
        });
      } catch (e: unknown) {
        this.logger.error(`Saving task failed. Failed xp object: ${JSON.stringify(xp, null, 2)}`);
        this.logger.error(JSON.stringify(e, null, 2));
      }
    }
  }
}
