import { Injectable, Logger } from "@nestjs/common";
import { MongoConfig, XpgoConfig } from "../shared/models/class/XpgoConfig";
import { ConfigService } from "@nestjs/config";
import { IconNetwork } from "../shared/models/enum/IconNetworks";
import MailerLite from "@mailerlite/mailerlite-nodejs";

@Injectable()
export class XpgoConfigService {
  private readonly logger = new Logger(XpgoConfigService.name);

  private readonly _config: XpgoConfig;
  private readonly _mailerlite: MailerLite;

  constructor(private configService: ConfigService) {
    const config = this.configService.get<XpgoConfig>("config");

    if (!config) throw new Error('this.configService.get<XpgoConfig>("config"); is UNDEFINED!!!');

    this._config = config;

    this._mailerlite = new MailerLite({
      api_key: config.mailerliteApiKey,
    });

    // destructure api key from config to avoid leaking API keys in logger
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { mailerliteApiKey, ...cleanConfig } = config;

    this.logger.warn(`Starting up with the following configuration:\n ${JSON.stringify(cleanConfig, null, 2)}`);
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

  get mailerlite(): MailerLite {
    return this._mailerlite;
  }

  get mailerliteGroupId(): string {
    return this._config.mailerliteGroupId;
  }
}
