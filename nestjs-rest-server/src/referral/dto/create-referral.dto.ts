import { Types } from "mongoose";
import { SeasonLabel } from "src/shared/models/enum/SeasonLabel";

export class CreateReferralDto {
  constructor(
    public referrerUserAddress: string,
    public referredUserAddress: string,
    public referralCode: string,
    public seasonLabel: SeasonLabel,
    public referrerUserId: Types.ObjectId, // MongoDB ObjectId of the referrer
    public referredUserId: Types.ObjectId, // MongoDB ObjectId of the referred
  ) {}
}
