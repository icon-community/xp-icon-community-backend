import { Injectable, Logger } from "@nestjs/common";
import { TaskInputTypeRegistration } from "../../shared/types/GeneralTypes";

@Injectable()
export class AwardRegistrationXpTask {
  private readonly logger = new Logger(AwardRegistrationXpTask.name);

  // constructor(
  //   private readonly userTaskDb: UsersTaskDbService,
  //   private readonly configHelper: ConfigHelperService,
  // ) {}

  async execute(...args: TaskInputTypeRegistration[]) {
    const [data] = args;
    try {
      const { userId, seasonId, seasonLabel, registrationBlock } = data;

      console.log(userId, seasonId, seasonLabel, registrationBlock);

      this.logger.log({
        level: "info",
        message: `Registration XP awarded for user ${userId} in season ${seasonLabel}`,
      });
    } catch (error) {
      this.logger.error(`Failed to award registration XP: ${error.message}`);
      throw error;
    }
  }
}
