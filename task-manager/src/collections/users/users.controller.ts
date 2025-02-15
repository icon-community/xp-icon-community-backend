import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Logger,
  Param,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { LinkWalletDto } from "./dto/link-wallet.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly usersService: UsersService) {}

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
}
