import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WinstonModule } from "nest-winston";
import { Logging } from "./shared/logging/custom-logger";
import { ResponseInterceptor } from "./shared/interceptors/response.interceptor";
import { HttpExceptionFilter } from "./shared/filters/http-exception.filter";
// import * as mongoose from 'mongoose';

async function bootstrap() {
  const customLoggerService = new Logging();

  // for debugging mongoose queries
  // mongoose.set('debug', true);

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(customLoggerService.createLoggerConfig),
  });
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3005);
}

bootstrap();
