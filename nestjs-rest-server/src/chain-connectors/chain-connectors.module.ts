import { Module } from "@nestjs/common";
import { IconConnectorService } from "./icon-connector.service";
import { XpgoConfigModule } from "../config/xpgo-config.module";

@Module({
  imports: [XpgoConfigModule],
  providers: [IconConnectorService],
  exports: [IconConnectorService],
})
export class ChainConnectorsModule {}
