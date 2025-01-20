import { Controller, Get, Param, Query, UnauthorizedException, UseGuards, ValidationPipe } from "@nestjs/common";
import { ReferralService } from "./referral.service";
import { IReferral } from "../db/schemas/Referral.schema";
import { AddressValidationPipe } from "../shared/pipes/address-validation-pipe.service";
import { FindUserReferralsQuery } from "./referral-queries";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiHeader } from "@nestjs/swagger";
import { UserAddress } from "../user/decorator/user.decorators";
import { ReferralDto } from "./dto/referral.dto";

@Controller("referral")
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Get(":address")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "authorization",
    description: "JWT Authorization header. E.g. 'Bearer {Token}'",
  })
  findUserReferrals(
    @Param("address", AddressValidationPipe) address: string,
    @UserAddress() publicAddress: string,
  ): Promise<ReferralDto[]> {
    if (publicAddress != address) {
      throw new UnauthorizedException(`Unauthorized to query user ${address} data`);
    }

    return this.referralService.findAllUserReferrals(address);
  }

  @Get(":address/period")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "authorization",
    description: "JWT Authorization header. E.g. 'Bearer {Token}'",
  })
  findUserReferralsForPeriod(
    @Param("address", AddressValidationPipe) address: string,
    @UserAddress() publicAddress: string,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    query: FindUserReferralsQuery,
  ): Promise<IReferral[]> {
    if (publicAddress != address) {
      throw new UnauthorizedException(`Unauthorized to query user ${address} data`);
    }

    return this.referralService.findAllUserReferralsForPeriod(address, query.start, query.end);
  }
}
