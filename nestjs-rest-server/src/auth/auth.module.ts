import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { XpgoConfigModule } from "../config/xpgo-config.module";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [XpgoConfigModule, HttpModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
