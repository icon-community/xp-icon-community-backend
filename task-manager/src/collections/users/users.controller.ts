import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post("/create-user")
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return {
        data: user,
        message: "User created successfully",
      };
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);

      if (error.code === 11000) {
        // MongoDB duplicate key error
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
}
