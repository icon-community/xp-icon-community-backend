import { Controller, Get, Param, Query, ValidationPipe } from "@nestjs/common";
import { ReferralService } from "./referral.service";
import { Referral } from "../db/schemas/Referral.schema";
import { Collections } from "../shared/models/enum/Collections";
import { IconEoaAddressValidationPipe } from "../shared/pipes/icon-eoa-address-validation-pipe.service";
import { FindUserReferralsQueryDTO } from "./dto/FindUserReferralsQueryDTO";

@Controller(Collections.REFERRALS)
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Get(":address")
  findUserReferrals(@Param("address", IconEoaAddressValidationPipe) address: string): Promise<Referral[]> {
    return this.referralService.findAllUserReferrals(address);
  }

  @Get(":address/period")
  findUserReferralsForPeriod(
    @Param("address", IconEoaAddressValidationPipe) address: string,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    query: FindUserReferralsQueryDTO,
  ): Promise<Referral[]> {
    return this.referralService.findAllUserReferralsForPeriod(address, query.start, query.end);
  }
}
