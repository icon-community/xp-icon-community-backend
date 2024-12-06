import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Collections } from "../../shared/models/enum/Collections";
import { DailyCheckInDocument, IDailyCheckIn } from "../schemas/DailyCheckIn.schema";
import { MongoDbErrorCode } from "../../shared/models/enum/MongoDbErrorCode";

@Injectable()
export class DailyCheckInDbService {
  private readonly logger = new Logger(DailyCheckInDbService.name);

  constructor(@InjectModel(Collections.DAILY_CHECK_IN) private dailyCheckInModel: Model<IDailyCheckIn>) {}

  async getUserDailyCheckIn(address: string): Promise<IDailyCheckIn | null> {
    return this.dailyCheckInModel
      .findOne({
        walletAddress: address,
      })
      .lean()
      .exec();
  }

  async createDailyCheckIn(data: IDailyCheckIn): Promise<DailyCheckInDocument> {
    try {
      return await new this.dailyCheckInModel(data).save();
    } catch (e) {
      if (e.code != MongoDbErrorCode.DUPLICATE) {
        this.logger.error(`Failed to save new daily check in equity.. Error: ${JSON.stringify(e, null, 2)}`);
      }

      throw e;
    }
  }

  async dailyCheckIn(address: string, newStreakCounter: number): Promise<IDailyCheckIn | null> {
    try {
      return this.dailyCheckInModel
        .findOneAndUpdate(
          {
            walletAddress: address,
          },
          {
            walletAddress: address,
            streakCounter: newStreakCounter,
            lastCheckIn: new Date(),
          } satisfies IDailyCheckIn,
          {
            new: true,
            upsert: true,
          },
        )
        .lean()
        .exec();
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
