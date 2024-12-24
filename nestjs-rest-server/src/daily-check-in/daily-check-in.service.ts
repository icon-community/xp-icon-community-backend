import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { formatDailyCheckIn } from "../shared/utils/mapper";
import { DailyCheckInDbService } from "../db/services/daily-check-in-db.service";
import { DailyCheckinDto } from "./dto/DailyCheckinDto";
import { addDays, subtractDays } from "../shared/utils/general-util";

@Injectable()
export class DailyCheckInService {
  private readonly logger = new Logger(DailyCheckInService.name);

  constructor(private dailyCheckinDbService: DailyCheckInDbService) {}

  async getUserDailyCheckInStreak(address: string): Promise<DailyCheckinDto> {
    const dailyCheckIn = await this.dailyCheckinDbService.getUserDailyCheckIn(address);

    if (dailyCheckIn) {
      const lastCheckInDay = new Date(dailyCheckIn.lastCheckIn.setHours(0, 0, 0, 0));
      const today = new Date(new Date().setHours(0, 0, 0, 0));
      const yesterday = new Date(subtractDays(today, 1).setHours(0, 0, 0, 0));

      // check if user last checked in at latest yesterday
      if (lastCheckInDay.getTime() >= yesterday.getTime()) {
        return {
          walletAddress: dailyCheckIn.walletAddress,
          streakCounter: dailyCheckIn.streakCounter,
          lastCheckIn: dailyCheckIn.lastCheckIn.getTime(),
          nextCheckIn: addDays(lastCheckInDay, 1).getTime(),
        };
      } else {
        // streak counter is not valid, because last check in was before yesterday
        return {
          walletAddress: dailyCheckIn.walletAddress,
          lastCheckIn: dailyCheckIn.lastCheckIn.getTime(),
          nextCheckIn: addDays(lastCheckInDay, 1).getTime(),
          streakCounter: 0,
        };
      }
    } else {
      throw new NotFoundException(`Daily check in for address=${address} not found`);
    }
  }

  async makeDailyCheckIn(address: string): Promise<DailyCheckinDto | HttpException> {
    const dailyCheckIn = await this.dailyCheckinDbService.getUserDailyCheckIn(address);

    if (dailyCheckIn == null) {
      // user is checking in for the first time
      return formatDailyCheckIn(
        await this.dailyCheckinDbService.createDailyCheckIn({
          walletAddress: address,
          streakCounter: 1,
          lastCheckIn: new Date(),
        }),
      );
    } else {
      // set dates to day based (set time to 0)
      const lastCheckInDay = new Date(dailyCheckIn.lastCheckIn.setHours(0, 0, 0, 0));
      const today = new Date(new Date().setHours(0, 0, 0, 0));
      const yesterday = new Date(subtractDays(today, 1).setHours(0, 0, 0, 0));

      if (lastCheckInDay.getTime() === yesterday.getTime()) {
        // valid check in
        const update = await this.dailyCheckinDbService.dailyCheckIn(address, dailyCheckIn.streakCounter + 1);

        if (update == null) {
          throw new BadRequestException("Failed to find user daily streak and update it");
        }

        return {
          walletAddress: update.walletAddress,
          streakCounter: update.streakCounter,
          lastCheckIn: update.lastCheckIn.getTime(),
          nextCheckIn: new Date(addDays(lastCheckInDay, 1).setHours(0, 0, 0, 0)).getTime(),
        };
      } else if (lastCheckInDay.getTime() < yesterday.getTime()) {
        // late check in, set counter to 1
        const update = await this.dailyCheckinDbService.dailyCheckIn(address, 1);

        if (update == null) {
          throw new BadRequestException("Failed to find user daily streak and update it");
        }

        return {
          walletAddress: update.walletAddress,
          streakCounter: update.streakCounter,
          lastCheckIn: update.lastCheckIn.getTime(),
          nextCheckIn: new Date(addDays(lastCheckInDay, 1).setHours(0, 0, 0, 0)).getTime(),
        };
      } else if (lastCheckInDay.getTime() >= today.getTime()) {
        // check in is happening today
        throw new BadRequestException("Daily check in already completed today.");
      } else {
        throw new InternalServerErrorException("Unknown state of last check in.");
      }
    }
  }
}
