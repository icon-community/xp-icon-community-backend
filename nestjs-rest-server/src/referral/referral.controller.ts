import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { ReferralService } from "./referral.service";
import { Referral } from "../db/schemas/Referral.schema";
import { AddressValidationPipe } from "../shared/pipes/icon-eoa-address-validation-pipe.service";
import { FindUserReferralsQueryDTO } from "./dto/FindUserReferralsQueryDTO";
import { UserAddress } from "../user/decorator/user.decorators";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiHeader } from "@nestjs/swagger";

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

  @Post(":address")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "authorization",
    description: "JWT Authorization header. E.g. 'Bearer {Token}'",
  })
  async createUserReferral(@Query("referralCode") referralCode: string, @UserAddress() address: string): Promise<void> {
    try {
      return await this.referralService.createUserReferral(referralCode, address);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
