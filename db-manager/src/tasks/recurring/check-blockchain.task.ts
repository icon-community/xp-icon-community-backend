import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class CheckBlockchainTask {
  private readonly logger: Logger = new Logger(CheckBlockchainTask.name);
  execute() {
    this.logger.log({
      level: 'info',
      message: 'CheckBlockchainTask executed',
    });
  }
}
