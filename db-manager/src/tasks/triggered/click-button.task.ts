import { Injectable } from "@nestjs/common";
import { Logger } from "@nestjs/common";

@Injectable()
export class ClickButtonTask {
  private readonly logger = new Logger(ClickButtonTask.name);
  execute(...rest): void {
    void rest;
    this.logger.log({
      level: "info",
      message: "ClickButtonTask executed",
    });
  }
}
