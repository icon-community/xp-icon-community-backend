import { Module } from "@nestjs/common";
import { DbModule } from "../db/db.module";
import { RankingService } from "./service/ranking.service";
import { CacheModule } from "@nestjs/cache-manager";
import { RANKINGS_DEFAULT_CACHE_MS } from "../constants";

@Module({
  imports: [
    CacheModule.register({
      ttl: RANKINGS_DEFAULT_CACHE_MS, // Cache expiration time in milliseconds
      max: 50, // Maximum number of items in cache
    }),
    DbModule,
  ],
  providers: [RankingService],
  exports: [RankingService],
})
export class RankingModule {}
