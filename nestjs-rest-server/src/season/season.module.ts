import { Module } from "@nestjs/common";
import { SeasonService } from "./season.service";
import { SeasonController } from "./season.controller";
import { DbModule } from "../db/db.module";
import { RankingModule } from "../ranking/ranking.module";
import { ChainConnectorsModule } from "../chain-connectors/chain-connectors.module";
import { CacheModule } from "@nestjs/cache-manager";
import { SEASON_CONTROLLER_CACHE_MS } from "../constants";

@Module({
  imports: [
    CacheModule.register({
      ttl: SEASON_CONTROLLER_CACHE_MS, // Cache expiration time in milliseconds
      max: 50, // Maximum number of items in cache
    }),
    DbModule,
    RankingModule,
    ChainConnectorsModule,
  ],
  controllers: [SeasonController],
  providers: [SeasonService],
  exports: [SeasonService],
})
export class SeasonModule {}
