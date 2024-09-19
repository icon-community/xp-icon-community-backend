import { Module } from "@nestjs/common";
import { DbModule } from "../db/db.module";
import { RankingService } from "./service/ranking.service";

@Module({
  imports: [DbModule],
  providers: [RankingService],
  exports: [RankingService],
})
export class RankingModule {}
