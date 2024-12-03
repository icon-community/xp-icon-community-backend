import { Controller, Get, HttpException, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiHeader } from "@nestjs/swagger";
import { DailyCheckInService } from "./daily-check-in.service";
import { UserAddress } from "../user/decorator/user.decorators";
import { DailyCheckinDto } from "./dto/DailyCheckinDto";

@Controller("daily-check-in")
export class DailyCheckInController {
  constructor(private readonly dailyCheckInService: DailyCheckInService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "authorization",
    description: "JWT Authorization header. E.g. 'Bearer {Token}'",
  })
  async getDailyCheckInStreak(@UserAddress() address: string): Promise<DailyCheckinDto> {
    return await this.dailyCheckInService.getUserDailyCheckInStreak(address);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "authorization",
    description: "JWT Authorization header. E.g. 'Bearer {Token}'",
  })
  async makeDailyCheckIn(@UserAddress() address: string): Promise<DailyCheckinDto> {
    const data = await this.dailyCheckInService.makeDailyCheckIn(address);

    if (data instanceof HttpException) {
      throw data;
    }

    return data;
  }
}
