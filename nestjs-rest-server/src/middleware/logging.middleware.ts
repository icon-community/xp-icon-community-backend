import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import * as morgan from "morgan";

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(HttpLoggerMiddleware.name);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  use(req: any, res: any, next: () => void): void {
    const requestBody = req.method === "POST" ? req.body : null;
    morgan(process.env.NODE_ENV === "prod" ? "common" : "dev", {
      stream: {
        write: (message) => {
          if (requestBody) {
            this.logger.log({
              message: message.trim(),
              body: requestBody,
            });
          } else {
            this.logger.log(message.trim());
          }
        },
      },
    })(req, res, next);
  }
}
