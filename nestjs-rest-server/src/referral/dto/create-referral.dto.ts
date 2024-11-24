import { Types } from "mongoose";

export class CreateReferralDto {
  constructor(
    public referrerUserAddress: string,
    public referredUserAddress: string,
    public referralCode: string,
    public referrerUserId: Types.ObjectId, // MongoDB ObjectId of the referrer
    public referredUserId: Types.ObjectId, // MongoDB ObjectId of the referred
  ) {}
}
