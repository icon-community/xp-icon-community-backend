export const TASKS_TYPES = {
  recurringTasks: 'RECURRING_TASKS',
  triggeredTasks: 'TRIGGERED_TASKS',
};

export const RECURRING_TASKS_TYPES = {
  depositSicxICON: 'DEPOSIT_SICX_COLLATERAL_ICON',
  mintingBnusdICON: 'MINTING_BNUSD_ICON',
  lockingSavingsRateICON: 'LOCKING_SAVINGS_RATE_ICON',
  depositAvaxCollateral: 'DEPOSIT_AVAX_COLLATERAL_ICON',
  depositNativeCrossChain: 'DEPOSIT_NATIVE_CROSSCHAIN_COLLATERAL',
  mintingBnusdCrossChain: 'MINTING_BNUSD_CROSSCHAIN',
  depositNativeSui: 'DEPOSIT_NATIVE_SUI_COLLATERAL',
  mintingBnusdSui: 'MINTING_BNUSD_SUI',
  usingReferralCode: 'USING_REFERRAL_CODE',
  referringUser: 'REFERRING_USER',
  dailyCheckInCrossChain: 'DAILY_CHECK_IN_CROSS_CHAIN_COLLATERAL',
  dailyCheckInSui: 'DAILY_CHECK_IN_SUI_COLLATERAL',
};
export const TRIGGERED_TASKS_TYPES = {
  newUser: 'NEW_USER',
  hanaNewsletter: 'HANA_NEWSLETTER',
  linkTwitterX: 'LINK_TWITTER_X',
  linkGoogle: 'LINK_GOOGLE',
  subscribeNewsletter: 'SUBSCRIBE_NEWSLETTER',
  feedTaskSeedToDb: 'FEED_TASK_SEED_TO_DB',
  feedTaskSeedToDbForce: 'FEED_TASK_SEED_TO_DB_FORCE',
  feedSeasonSeedToDb: 'FEED_SEASON_SEED_TO_DB',
  feedSeasonSeedToDbForce: 'FEED_SEASON_SEED_TO_DB_FORCE',
};
export const DB_CONNECTION = 'DB_CONNECTION';

export const CHAINS = {
  evm: [
    '0x2105.base',
    '0x38.bsc',
    '0x89.polygon',
    '0xa.optimism',
    '0xa4b1.arbitrum',
    '0xa86a.avax',
  ],
};
export const TOKENS = {
  avax: 'AVAX',
  bnb: 'BNB',
  btc: 'BTC',
  btcb: 'BTCB',
  eth: 'ETH',
  inj: 'INJ',
  sicx: 'sICX',
  tbtc: 'tBTC',
  weeth: 'weETH',
  wsteth: 'wstETH',
  bnusd: 'bnUSD',
};

export const ICON_CHAIN_INFO = {
  termPeriod: 43200,
  mainnet: {
    rpc: 'https://ctz.solidwallet.io/api/v3',
    nid: 1,
    contracts: {
      chain: 'cx0000000000000000000000000000000000000000',
      registrationBook: 'cxadd474e5c9845be73aff4168d25426368190fddc',
      balanced: {
        savings: 'cxd82fb5d3effecd8c9071a4bba3856ad7222c4b91',
        loans: 'cx66d4d90f5f113eba575bf793570135f9b10cece1',
      },
    },
  },
};

export const SEASONS_ROUTES = {
  sui: 1,
};
