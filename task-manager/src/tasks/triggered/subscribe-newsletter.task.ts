import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class SubscribeNewsletterTask {
  private readonly logger = new Logger(SubscribeNewsletterTask.name);
  execute(...args: any[]): void {
    void args;
    this.logger.log({
      level: "info",
      message: "SubscribeNewsletterTask executed",
    });
  }
}
