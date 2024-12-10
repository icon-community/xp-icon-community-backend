import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { SeasonService } from "../season/season.service";
import { SeasonLabel } from "../shared/models/enum/SeasonLabel";
import { TaskDbService } from "../db/services/task-db.service";
import { UsersTaskDbService } from "../db/services/user-task-db.service";
import { UserDocument } from "../db/schemas/User.schema";
import { TaskLabel, tasks } from "./tasks.config";
import { HanaNewsletterXpDetails, IXpEarned, UserTaskDocument } from "../db/schemas/UserTask.schema";
import { isHanaNewsletterXpDetails } from "../shared/type.guards";
import { Status } from "../shared/models/enum/Status";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private seasonService: SeasonService,
    private taskDbService: TaskDbService,
    private userTaskDbService: UsersTaskDbService,
  ) {}

  async issueHanaNewsletterSubscriptionXp(seasonLabel: SeasonLabel, email: string, user: UserDocument): Promise<void> {
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
