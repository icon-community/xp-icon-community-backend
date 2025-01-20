import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Types } from "mongoose";
import { CreateReferralDto } from "./dto/create-referral.dto";
import { IReferral } from "../db/schemas/Referral.schema";
import { UsersDbService } from "../db/services/users-db.service";
import { ReferralDbService } from "../db/services/referral-db.service";
import { formatReferral } from "../shared/utils/mapper";
import { ReferralDto } from "./dto/referral.dto";
import { SeasonLabel } from "src/shared/models/enum/SeasonLabel";

@Injectable()
export class ReferralService {
  constructor(
    private readonly referralDb: ReferralDbService,
    private readonly userDb: UsersDbService,
  ) {}

  async findAllUserReferrals(address: string): Promise<ReferralDto[]> {
    return (await this.referralDb.getUserReferrals(address)).map((v) => formatReferral(v));
  }

  findAllUserReferralsForPeriod(address: string, start: Date, end: Date): Promise<IReferral[]> {
    return this.referralDb.getUserReferralsForPeriod(address, start, end);
  }

  async createUserReferral(
    referralCode: string,
    seasonLabel: SeasonLabel,
    publicAddress: string,
    referredId: Types.ObjectId,
  ): Promise<void> {
    // find referrer user
    const referrerUser = await this.userDb.getUsersByReferralCode(referralCode);

    if (!referrerUser) {
      throw new BadRequestException(`Failed to find referral user for ${referralCode} code.`);
    }

    if (referredId.toString().toLowerCase() === referrerUser._id.toString().toLowerCase()) {
      throw new BadRequestException("Referrer and referred user cannot be the same");
    }

    try {
      await this.createReferral({
        referrerUserAddress: referrerUser.walletAddress,
        referrerUserId: referrerUser._id,
        referralCode: referralCode,
        referredUserAddress: publicAddress,
        referredUserId: referredId,
        seasonLabel: seasonLabel,
      });
    } catch {
      throw new InternalServerErrorException("Failed to create referral");
    }
  }

  private createReferral(createReferralDto: CreateReferralDto): Promise<boolean> {
    return this.referralDb.createReferral(createReferralDto);
  }
}
