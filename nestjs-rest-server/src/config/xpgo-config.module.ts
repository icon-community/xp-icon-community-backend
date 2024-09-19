import { Module } from "@nestjs/common";
import { XpgoConfigService } from "./xpgo-config.service";
import { ConfigModule } from "@nestjs/config";
import configuration from "./configuration";

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration],
    }),
  ],
  providers: [XpgoConfigService],
  exports: [XpgoConfigService],
})
export class XpgoConfigModule {}
