import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "@nestjs/common";
import * as winston from "winston";
import "winston-daily-rotate-file";
import { WinstonModule } from "nest-winston";
import { LOG_LEVEL } from "./config/configuration";
import { HttpExceptionFilter } from "./shared/filters/http-exception.filter";

async function bootstrap(): Promise<void> {
  const port = process.env.PORT ?? 3000;

  // create winston logger
  const alignedWithColorsAndTime = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
  );

  const transport = new winston.transports.DailyRotateFile({
    format: alignedWithColorsAndTime,
    level: LOG_LEVEL ?? "debug",
    filename: `./logs/rest-server-${port}-%DATE%.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
  });

  const logger = winston.createLogger({
    transports: [
      transport,
      new winston.transports.Console({
        format: alignedWithColorsAndTime,
        level: LOG_LEVEL ?? "debug",
      }),
    ],
  });

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: logger,
    }),
    abortOnError: true,
    cors: {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });

  app.useGlobalFilters(new HttpExceptionFilter(app.get<Logger>(Logger)));

  // setup well-known security headers
  app.use(helmet());

  const globalPrefix = "v1";
  app.setGlobalPrefix(globalPrefix);

  // register Swagger at /docs endpoint
  const config = new DocumentBuilder()
    .setTitle("Icon Identity Provider")
    .setDescription("The Auth API description")
    .setVersion("1.0")
    .addTag("auth")
    .build();

  SwaggerModule.setup("/docs", app, SwaggerModule.createDocument(app, config));

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://<domain>:${port}/${globalPrefix}`);
}
bootstrap().catch((err) => console.error(err));
