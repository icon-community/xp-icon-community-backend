import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class SubscribeNewsletterTask {
  private readonly logger = new Logger(SubscribeNewsletterTask.name);
  execute() {
    this.logger.log({
      level: 'info',
      message: 'SubscribeNewsletterTask executed',
    });
  }
}
