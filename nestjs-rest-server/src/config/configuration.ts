import "dotenv-flow/config";
import { registerAs } from "@nestjs/config";
import { Env } from "../shared/models/enum/Env";
import { validateUtil } from "../shared/utils/validate-util";
import { XpgoConfig } from "../shared/models/class/XpgoConfig";
import { LogLevel } from "../shared/models/enum/LogLevel";
import { IconNetwork } from "../shared/models/enum/IconNetworks";
import { IconNetworkConfig } from "../shared/models/types/Icon";
import { SeasonLabel } from "../shared/models/enum/SeasonLabel";

export const ENV: Env = process.env.NODE_ENV as Env;
export const LOG_LEVEL = process.env.LOG_LEVEL as LogLevel;

const evnConfig: Record<string, unknown> = {
  env: ENV,
  logLevel: LOG_LEVEL,
  port: process.env.PORT,
  iconNetwork: process.env.ICON_NETWORK,
  authServerUrl: process.env.AUTH_URL,
  mongoConfig: JSON.parse(process.env.MONGO_CONFIG ?? "{}"),
};

export default registerAs("config", () => {
  return validateUtil(evnConfig, XpgoConfig);
});

export const iconChainConfigs: Record<IconNetwork, IconNetworkConfig> = {
  [IconNetwork.mainnet]: {
    rpc: "https://ctz.solidwallet.io/api/v3",
    rpcDebug: "https://ctz.solidwallet.io/api/debug/v3",
    nid: 1,
    contracts: {
      chain: "cx0000000000000000000000000000000000000000",
      registrationBook: "cxadd474e5c9845be73aff4168d25426368190fddc",
      balanced: {
        savings: "cxd82fb5d3effecd8c9071a4bba3856ad7222c4b91",
        loans: "cx66d4d90f5f113eba575bf793570135f9b10cece1",
      },
    },
  },
  [IconNetwork.devnet]: {
    rpc: "https://tt.net.solidwallet.io/jvm-rpc/api/v3",
    rpcDebug: "https://tt.net.solidwallet.io/jvm-rpc/api/debug/v3",
    nid: 3,
    contracts: {
      chain: "cx0000000000000000000000000000000000000000",
      registrationBook: undefined,
      balanced: {
        savings: undefined,
        loans: undefined,
      },
    },
  },
  [IconNetwork.lisbon]: {
    rpc: "https://lisbon.net.solidwallet.io/api/v3",
    rpcDebug: "https://lisbon.net.solidwallet.io/api/debug/v3",
    nid: 2,
    contracts: {
      chain: "cx0000000000000000000000000000000000000000",
      registrationBook: "cx095c4e2fbacc1d5268c16a1ef6232290b1db0d8d",
      balanced: {
        savings: undefined,
        loans: undefined,
      },
    },
  },
};

export const seasonsConfig = {
  routes: {
    balanced: 1,
  } as Record<SeasonLabel, number>,
} as const;
