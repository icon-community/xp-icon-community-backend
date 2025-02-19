import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class SubscribeNewsletterTask {
  private readonly logger = new Logger(SubscribeNewsletterTask.name);

  async execute(...args: any[]): Promise<void> {
    void args;
    this.logger.log({
      level: "info",
      message: "SubscribeNewsletterTask executed",
    });
  }
}
