import { Module } from "@nestjs/common";
import { SeasonService } from "./season.service";
import { SeasonController } from "./season.controller";
import { DbModule } from "../db/db.module";
import { RankingModule } from "../ranking/ranking.module";
import { ChainConnectorsModule } from "../chain-connectors/chain-connectors.module";

@Module({
  imports: [DbModule, RankingModule, ChainConnectorsModule],
  controllers: [SeasonController],
  providers: [SeasonService],
})
export class SeasonModule {}
