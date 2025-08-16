import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DailyCheckInService } from "./daily-check-in.service";
import { DailyCheckInSchema } from "./schemas/daily-check-in.schema";
import MONGO_CONFIG from "../../config/mongo.config";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MONGO_CONFIG.collections.dailyCheckIn,
        schema: DailyCheckInSchema,
      },
    ]),
  ],
  providers: [DailyCheckInService],
  exports: [DailyCheckInService],
})
export class DailyCheckInModule {}
