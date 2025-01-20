import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Logger,
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
import { UserResponseDto } from "./dto/user-response.dto";
import { LinkSocialDataDto } from "./dto/link-social-data.dto";
import { LinkWalletDto } from "./dto/link-wallet.dto";
import { RegisterSeasonDto } from "./dto/register-season.dto";
import { SubscribeHanaNewsletterDto } from "./dto/subscribe-hana-newsletter.dto";
import { EmailQueryParam, ReferralQueryParam } from "./user-queries";
import { MaileriteSubscriberDto } from "./dto/mailerite-subscriber.dto";

@Controller("user")
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get("/hana-newsletter/subscriber")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "authorization",
    description: "JWT Authorization header. E.g. 'Bearer {Token}'",
  })
  async getMailerLiteSubscriber(
    @UserAddress() publicAddress: string,
    @Query(new ValidationPipe()) emailParam: EmailQueryParam,
  ): Promise<MaileriteSubscriberDto> {
    try {
      return await this.userService.getMailerLiteSubscriber(emailParam.email, publicAddress);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      } else {
        this.logger.error(e);
        throw new InternalServerErrorException(e.message);
      }
    }
  }

  @Post("/hana-newsletter/subscribe")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "authorization",
    description: "JWT Authorization header. E.g. 'Bearer {Token}'",
  })
  @UsePipes(new ValidationPipe())
  async subscribeUserToMailerLite(
    @Body() dto: SubscribeHanaNewsletterDto,
    @UserAddress() publicAddress: string,
  ): Promise<MaileriteSubscriberDto> {
    return await this.userService.subscribeUserToMailerLite(dto.season, dto.email, publicAddress);
  }

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
    @Query(new ValidationPipe()) referralQueryParam: ReferralQueryParam,
  ): Promise<UserResponseDto> {
    return this.userService.registerUser(publicAddress, referralQueryParam);
  }

  @Post("/register-season")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "authorization",
    description: "JWT Authorization header. E.g. 'Bearer {Token}'",
  })
  @UsePipes(new ValidationPipe())
  async registerSeason(
    @UserAddress() publicAddress: string,
    @Body() body: RegisterSeasonDto,
  ): Promise<UserResponseDto> {
    const { seasonLabel } = body;
    return this.userService.registerSeason(publicAddress, seasonLabel);
  }

  @Post("/link-social")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "authorization",
    description: "JWT Authorization header. E.g. 'Bearer {Token}'",
  })
  @UsePipes(new ValidationPipe())
  async linkUserSocial(
    @UserAddress() address: string,
    @Body() socialDataDto: LinkSocialDataDto,
  ): Promise<UserResponseDto> {
    const data = await this.userService.linkUserSocial(socialDataDto, address);

    if (data instanceof HttpException) {
      throw data;
    }

    return data;
  }

  @Post("/link-wallet")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "authorization",
    description: "JWT Authorization header. E.g. 'Bearer {Token}'",
  })
  @UsePipes(new ValidationPipe())
  async linkUserWallet(@UserAddress() address: string, @Body() linkWalletDto: LinkWalletDto): Promise<UserResponseDto> {
    const data = await this.userService.linkUserWallet(linkWalletDto, address);

    if (data instanceof HttpException) {
      throw data;
    }

    return data;
  }

  @Get(":address")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "authorization",
    description: "JWT Authorization header. E.g. 'Bearer {Token}'",
  })
  async getUser(@UserAddress() publicAddress: string, @Param("address") address: string): Promise<UserResponseDto> {
    if (publicAddress != address) {
      throw new UnauthorizedException(`Unauthorized to query user ${address} data`);
    }

    try {
      return await this.userService.getUser(publicAddress);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      } else {
        this.logger.error(e);
        throw new InternalServerErrorException(e.message);
      }
    }
  }

  //TODO: fix this endpoint, due to the change in logic
  // that now we dont use smart contracts to track the
  // user registration to a season, this endpoint is broken
  // is returning values for user and season when the user
  // is not registered to the season.
  // create a check that validates that the user is
  // registered to the season before returning the data
  @Get("/:userWallet/season/:season")
  async getUserBySeason(
    @Param("userWallet") userWallet: string,
    @Param("season") season: SeasonLabel,
  ): Promise<FormattedUserSeason> {
    const data = await this.userService.getUserBySeason(userWallet, season);

    if (data instanceof HttpException) {
      throw data;
    }

    return data;
  }

  @Get("/referral-code")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "authorization",
    description: "JWT Authorization header. E.g. 'Bearer {Token}'",
  })
  async getUserReferralCode(@UserAddress() publicAddress: string): Promise<ReferralCodeDto> {
    try {
      return { code: await this.userService.getUserReferralCode(publicAddress) };
    } catch (e) {
      this.logger.error(e);
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new InternalServerErrorException({
          error: e.message,
        });
      }
    }
  }
}
