import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Referral } from "../../schemas/Referral.schema";
import { CreateReferralDto } from "../../../referral/dto/create-referral.dto";
import { MongoDbErrorCode } from "../../../shared/models/enum/MongoDbErrorCode";
import { Collections } from "../../../shared/models/enum/Collections";

@Injectable()
export class ReferralDbService {
  private readonly logger = new Logger(ReferralDbService.name);

  constructor(@InjectModel(Collections.REFERRALS) private referralModel: Model<Referral>) {}

  async createReferral(referral: CreateReferralDto): Promise<boolean> {
    try {
      const createdReferral = await new this.referralModel(referral).save();

      return createdReferral != null;
    } catch (e) {
      // entry exists, handle gracefully
      if (e.code == MongoDbErrorCode.DUPLICATE) {
        this.logger.warn(`Duplicate referral: ${JSON.stringify(referral, null, 2)}`);
        return true;
      }

      this.logger.error(`Failed to save referral: ${JSON.stringify(e, null, 2)}`);
      throw e;
    }
  }

  async getUserReferrals(address: string): Promise<Referral[]> {
    try {
      return this.referralModel
        .find({
          referrerUserAddress: address.toLowerCase(),
        })
        .lean()
        .select("-_id")
        .exec();
    } catch (e) {
      this.logger.error(`Failed to fetch user referrals: ${JSON.stringify(e, null, 2)}`);
      throw e;
    }
  }

  async getUserReferralsForPeriod(address: string, start: Date, end: Date): Promise<Referral[]> {
    try {
      return this.referralModel
        .find({
          referrerUserAddress: address.toLowerCase(),
          createdAt: { $gte: start, $lte: end },
        })
        .lean()
        .select("-_id")
        .exec();
    } catch (e) {
      this.logger.error(`Failed to fetch user referrals for period: ${JSON.stringify(e, null, 2)}`);
      throw e;
    }
  }
}
