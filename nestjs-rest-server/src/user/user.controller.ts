import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { SeasonLabel } from "../shared/models/enum/SeasonLabel";
import { UserAddress } from "./decorator/user.decorators";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ReferralCodeDto } from "./dto/referral-code.dto";
import { ApiHeader, ApiQuery } from "@nestjs/swagger";
import { FormattedUserSeason } from "../shared/models/types/FormattedTypes";
import { ValidationPipe } from "../shared/pipes/validation.pipe";
import { UserResDto } from "./dto/user-res.dto";
import { LinkSocialDataDto } from "./dto/link-social-data.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/register")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "authorization",
    description: "JWT Authorization header. E.g. 'Bearer {Token}'",
  })
  @ApiQuery({
    name: "referralCode",
    type: String,
    description: "Optional referral code",
    required: false,
  })
  @UsePipes(new ValidationPipe())
  async register(
    @UserAddress() publicAddress: string,
    @Query("referralCode") referralCode?: string,
  ): Promise<UserResDto> {
    return this.userService.registerUser(publicAddress.toLowerCase(), referralCode);
  }

  @Post("/link-social")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "authorization",
    description: "JWT Authorization header. E.g. 'Bearer {Token}'",
  })
  @UsePipes(new ValidationPipe())
  linkUserSocial(@UserAddress() address: string, @Body() socialDataDto: LinkSocialDataDto): Promise<UserResDto> {
    return this.userService.linkUserSocial(socialDataDto, address);
  }

  @Get(":address")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "authorization",
    description: "JWT Authorization header. E.g. 'Bearer {Token}'",
  })
  async getUser(@UserAddress() publicAddress: string, @Param("address") address: string): Promise<UserResDto> {
    if (publicAddress != address) {
      throw new UnauthorizedException(`Unauthorized to query user ${address} data`);
    }

    try {
      return await this.userService.getUser(publicAddress);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      } else {
        console.error(e);
        throw new InternalServerErrorException(e.message);
      }
    }
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
