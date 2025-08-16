import { Module } from "@nestjs/common";
import { SeasonsService } from "./seasons.service";
import { SeasonSchema } from "./schemas/seasons.schema";
import MONGO_CONFIG from "../../config/mongo.config";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MONGO_CONFIG.collections.seasons, schema: SeasonSchema },
    ]),
  ],
  providers: [SeasonsService],
  exports: [SeasonsService],
})
export class SeasonsModule {}
