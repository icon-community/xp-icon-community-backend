import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WinstonModule } from "nest-winston";
import { Logging } from "./shared/logging/custom-logger";
// import * as mongoose from 'mongoose';

async function bootstrap() {
  const customLoggerService = new Logging();

  // for debugging mongoose queries
  // mongoose.set('debug', true);

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(customLoggerService.createLoggerConfig),
  });
  await app.listen(3005);
}

bootstrap();
