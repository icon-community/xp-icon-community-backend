import { AppService } from "./app.service";
import {
  Controller,
  Post,
  Get,
  Body,
  HttpException,
  HttpStatus,
  Logger,
  Param,
} from "@nestjs/common";
import { CreateUserDto } from "./collections/users/dto/create-user.dto";
import { LinkWalletDto } from "./collections/users/dto/link-wallet.dto";
import { RegisterToSeasonDto } from "./collections/users/dto/register-to-season.dto";
import { UsersService } from "./collections/users/users.service";
import { SeasonsService } from "./collections/seasons/seasons.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/subscribe-newsletter")
  async subscribeNewsletter(): Promise<void> {
    await this.appService.subscribeNewsletter();
  }
}

@Controller("users")
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly seasonsService: SeasonsService,
    private readonly appService: AppService,
  ) {}

  @Post("/create-user")
  async createUser(@Body() createUserDto: CreateUserDto) {
    this.logger.log({
      level: "info",
      message: `Create user request received for wallet: ${createUserDto.walletAddress}`,
    });

    try {
      const user = await this.usersService.create(createUserDto);
      this.logger.log({
        level: "info",
        message: `User created successfully for wallet: ${createUserDto.walletAddress}`,
      });
      return {
        data: user,
        message: "User created successfully",
      };
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);

      if (error.code === 11000) {
        throw new HttpException(
          {
            success: false,
            message: "User with this wallet address already exists",
            error: "DUPLICATE_USER",
          },
          HttpStatus.CONFLICT,
        );
      }

      throw new HttpException(
        {
          success: false,
          message: "Failed to create user",
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("/:address/link-wallet")
  async linkWallet(
    @Param("address") address: string,
    @Body() linkWalletDto: LinkWalletDto,
  ) {
    this.logger.log({
      level: "info",
      message: `Link wallet request received. User: ${address}, New wallet: ${linkWalletDto.address} (${linkWalletDto.type})`,
    });

    try {
      const user = await this.usersService.linkWallet(address, linkWalletDto);

      if (!user) {
        throw new HttpException(
          {
            success: false,
            message: "User not found or wallet already linked",
            error: "USER_NOT_FOUND_OR_WALLET_LINKED",
          },
          HttpStatus.NOT_FOUND,
        );
      }

      this.logger.log({
        level: "info",
        message: `Wallet linked successfully. User: ${address}, New wallet: ${linkWalletDto.address} (${linkWalletDto.type})`,
      });

      return {
        data: user,
        message: "Wallet linked successfully",
      };
    } catch (error) {
      this.logger.error(`Failed to link wallet: ${error.message}`, error.stack);

      if (error.message.includes("Invalid")) {
        throw new HttpException(
          {
            success: false,
            message: error.message,
            error: "INVALID_WALLET",
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        {
          success: false,
          message: "Failed to link wallet",
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("/:address/register-season")
  async registerSeason(
    @Param("address") address: string,
    @Body() registerSeasonDto: RegisterToSeasonDto,
  ) {
    this.logger.log({
      level: "info",
      message: `Register season request received. User: ${address}, Season: ${registerSeasonDto.label}`,
    });

    try {
      // Find the season
      const season = await this.seasonsService.findByLabel(
        registerSeasonDto.label,
      );

      if (!season) {
        throw new HttpException(
          {
            success: false,
            message: "Season not found",
            error: "SEASON_NOT_FOUND",
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Register user to season
      const user = await this.usersService.registerSeason(
        address,
        season._id,
        registerSeasonDto.registrationBlock,
      );

      if (!user) {
        throw new HttpException(
          {
            success: false,
            message: "User not found",
            error: "USER_NOT_FOUND",
          },
          HttpStatus.NOT_FOUND,
        );
      }
      try {
        await this.appService.awardRegistrationXp({
          userId: user._id.toString(),
          seasonId: season._id.toString(),
          seasonLabel: registerSeasonDto.label,
          registrationBlock: registerSeasonDto.registrationBlock,
        });
      } catch (err) {
        this.logger.error(
          `Failed to award registration XP: ${err.message}`,
          err.stack,
        );
      }

      this.logger.log({
        level: "info",
        message: `User registered to season successfully. User: ${address}, Season: ${registerSeasonDto.label}`,
      });

      return {
        data: user,
        message: "User registered to season successfully",
      };
    } catch (error) {
      this.logger.error(
        `Failed to register season: ${error.message}`,
        error.stack,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          message: "Failed to register season",
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
