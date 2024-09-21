import { Injectable } from "@nestjs/common";
import { ReferralDbService } from "../db/services/users-db/referral-db.service";
import { CreateReferralDto } from "./dto/create-referral.dto";
import { Referral } from "../db/schemas/Referral.schema";

@Injectable()
export class ReferralService {
  constructor(private readonly referralDb: ReferralDbService) {}

  createReferral(createReferralDto: CreateReferralDto): Promise<boolean> {
    return this.referralDb.createReferral(createReferralDto);
  }

  findAllUserReferrals(address: string): Promise<Referral[]> {
    return this.referralDb.getUserReferrals(address);
  }

  findAllUserReferralsForPeriod(address: string, start: Date, end: Date): Promise<Referral[]> {
    return this.referralDb.getUserReferralsForPeriod(address, start, end);
  }
}
