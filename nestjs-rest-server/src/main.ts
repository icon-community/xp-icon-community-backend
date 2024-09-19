import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "@nestjs/common";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    abortOnError: true,
    cors: {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });

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

  const port = process.env.PORT ?? 3000;

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://<domain>:${port}/${globalPrefix}`);
}
bootstrap().catch((err) => console.error(err));
