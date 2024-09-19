import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import * as morgan from "morgan";

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(HttpLoggerMiddleware.name);

  use(req: any, res: any, next: () => void): void {
    morgan(process.env.NODE_ENV === "prod" ? "common" : "dev", {
      stream: {
        write: (message) => this.logger.log(message),
      },
    })(req, res, next);
  }
}
