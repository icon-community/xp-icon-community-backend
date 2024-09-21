import { Controller, Get, Param, InternalServerErrorException, UseGuards, Post, UsePipes } from "@nestjs/common";
import { UserService } from "./user.service";
import { SeasonLabel } from "../shared/models/enum/SeasonLabel";
import { UserAddress } from "./decorator/user.decorators";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ReferralCodeDto } from "./dto/referral-code.dto";
import { ApiHeader, ApiParam } from "@nestjs/swagger";
import { FormattedUserSeason } from "../shared/models/types/FormattedTypes";
import { ValidationPipe } from "../shared/pipes/validation.pipe";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/register")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "authorization",
    description: "JWT Authorization header. E.g. 'Bearer {Token}'",
  })
  @ApiParam({
    name: "referralCode",
    type: String,
    description: "Optional referral code",
    required: false,
  })
  @UsePipes(new ValidationPipe())
  async register(@UserAddress() publicAddress: string, @Param("referralCode") referralCode?: string): Promise<void> {
    return this.userService.registerUser(publicAddress.toLowerCase(), referralCode);
  }

  @Get(":address")
  getUserAllSeasons(): void {
    return this.userService.getUserAllSeasons();
  }

  @Get("/:userWallet/season/:season")
  async getUserBySeason(
    @Param("userWallet") userWallet: string,
    @Param("season") season: SeasonLabel,
  ): Promise<FormattedUserSeason> {
    try {
      return this.userService.getUserBySeason(userWallet.toLowerCase(), season);
    } catch (e) {
      throw new InternalServerErrorException({
        error: e.message,
      });
    }
  }

  @Get("/referral-code")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "authorization",
    description: "JWT Authorization header. E.g. 'Bearer {Token}'",
  })
  async getUserReferralCode(@UserAddress() publicAddress: string): Promise<ReferralCodeDto> {
    try {
      return { code: await this.userService.getUserReferralCode(publicAddress.toLowerCase()) };
    } catch (e) {
      throw new InternalServerErrorException({
        error: e.message,
      });
    }
  }
}
