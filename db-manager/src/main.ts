import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { Logging } from './common/logging/custom-logger';

async function bootstrap() {
  const customLoggerService = new Logging();
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(customLoggerService.createLoggerConfig),
  });
  await app.listen(3005);
}

bootstrap();
