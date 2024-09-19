import { Injectable } from "@nestjs/common";
import IconService, { BigNumber } from "icon-sdk-js";
import { XpgoConfigService } from "../config/xpgo-config.service";
import { iconChainConfigs } from "../config/configuration";
import { Hash } from "icon-sdk-js/build/types/hash";

@Injectable()
export class IconConnectorService {
  public readonly iconService: IconService;

  constructor(private config: XpgoConfigService) {
    const httpProvider = new IconService.HttpProvider(iconChainConfigs[this.config.iconNetwork].rpc);
    this.iconService = new IconService(httpProvider);
  }

  async getIcxBalance(address: string, normalised = false, height?: Hash): Promise<BigNumber> {
    const res = await this.iconService.getBalance(address, height).execute();

    if (normalised) {
      return res.div(10 ** 18);
    }

    return res;
  }
}
