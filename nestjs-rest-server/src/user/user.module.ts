import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { DbModule } from "../db/db.module";
import { RankingModule } from "../ranking/ranking.module";
import { AuthModule } from "../auth/auth.module";
import { HttpModule } from "@nestjs/axios";
import { XpgoConfigModule } from "../config/xpgo-config.module";

@Module({
  imports: [HttpModule, XpgoConfigModule, DbModule, RankingModule, AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
