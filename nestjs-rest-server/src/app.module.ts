import { Logger, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HttpLoggerMiddleware } from "./middleware/logging.middleware";
import { SeasonModule } from "./season/season.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { RankingModule } from "./ranking/ranking.module";
import { ChainConnectorsModule } from "./chain-connectors/chain-connectors.module";
import { ValidationPipe } from "./shared/pipes/validation.pipe";
import { XpgoConfigModule } from "./config/xpgo-config.module";
import { IconEoaAddressValidationPipe } from "./shared/pipes/icon-eoa-address-validation-pipe.service";
import { MongooseModule } from "@nestjs/mongoose";
import { XpgoConfigService } from "./config/xpgo-config.service";
import { ReferralModule } from "./referral/referral.module";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [XpgoConfigModule],
      useFactory: async (configService: XpgoConfigService) => {
        const mongoConfig = configService.mongoConfig;
        return {
          uri: mongoConfig.url,
          dbName: mongoConfig.dbName,
        };
      },
      inject: [XpgoConfigService],
    }),
    SeasonModule,
    UserModule,
    AuthModule,
    XpgoConfigModule,
    ChainConnectorsModule,
    RankingModule,
    ReferralModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger, ValidationPipe, IconEoaAddressValidationPipe],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLoggerMiddleware).forRoutes("*");
  }
}
