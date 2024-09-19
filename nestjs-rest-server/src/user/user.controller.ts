import { Controller, Get, Param, InternalServerErrorException, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { SeasonLabel } from "../shared/models/enum/SeasonLabel";
import { UserAddress } from "./decorator/user.decorators";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":address")
  getUserAllSeasons() {
    return this.userService.getUserAllSeasons();
  }

  @Get("/:userWallet/season/:season")
  getUserBySeason(@Param("userWallet") userWallet: string, @Param("season") season: SeasonLabel) {
    try {
      return this.userService.getUserBySeason(userWallet, season);
    } catch (e) {
      return new InternalServerErrorException({
        error: e.message,
      });
    }
  }

  @Get("/auth-test")
  @UseGuards(JwtAuthGuard)
  getMockUserAuthenticated(@UserAddress() publicAddress: string) {
    return `Authenticated as ${publicAddress}`;
  }
}
