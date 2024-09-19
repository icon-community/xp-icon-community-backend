import { Injectable, Logger } from "@nestjs/common";
import { MongoConfig, XpgoConfig } from "../shared/models/class/XpgoConfig";
import { ConfigService } from "@nestjs/config";
import { IconNetwork } from "../shared/models/enum/IconNetworks";

@Injectable()
export class XpgoConfigService {
  private readonly logger = new Logger(XpgoConfigService.name);

  private readonly _config: XpgoConfig;

  constructor(private configService: ConfigService) {
    const config = this.configService.get<XpgoConfig>("config");

    if (!config) throw new Error('this.configService.get<XpgoConfig>("config"); is UNDEFINED!!!');

    this._config = config;

    this.logger.warn(`Starting up with the following configuration:\n ${JSON.stringify(this._config, null, 2)}`);
  }

  get iconNetwork(): IconNetwork {
    return this._config.iconNetwork;
  }

  get authServerUrl(): string {
    return this._config.authServerUrl;
  }

  get mongoConfig(): MongoConfig {
    return this._config.mongoConfig;
  }
}
