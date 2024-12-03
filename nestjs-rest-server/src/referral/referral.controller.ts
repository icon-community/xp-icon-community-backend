import { Controller, Get, Param, Query, ValidationPipe } from "@nestjs/common";
import { ReferralService } from "./referral.service";
import { Referral } from "../db/schemas/Referral.schema";
import { AddressValidationPipe } from "../shared/pipes/address-validation-pipe.service";
import { FindUserReferralsQueryDTO } from "./dto/FindUserReferralsQueryDTO";

@Controller("referral")
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Get(":address")
  findUserReferrals(@Param("address", AddressValidationPipe) address: string): Promise<Referral[]> {
    return this.referralService.findAllUserReferrals(address);
  }

  @Get(":address/period")
  findUserReferralsForPeriod(
    @Param("address", AddressValidationPipe) address: string,
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
