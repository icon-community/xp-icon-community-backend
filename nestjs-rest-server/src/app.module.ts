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
import { AddressValidationPipe } from "./shared/pipes/address-validation-pipe.service";
import { MongooseModule } from "@nestjs/mongoose";
import { XpgoConfigService } from "./config/xpgo-config.service";
import { ReferralModule } from "./referral/referral.module";
import { DailyCheckInModule } from "./daily-check-in/daily-check-in.module";
import { TasksModule } from "./tasks/tasks.module";

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
    DailyCheckInModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger, ValidationPipe, AddressValidationPipe],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLoggerMiddleware).forRoutes("*");
  }
}
