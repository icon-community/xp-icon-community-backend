require("dotenv").config();
const fs = require("fs");
const customPath = require("./customPath");

const TASKS_DATA_FILE = customPath("data/tasks-seed.json");
const SEASONS_DATA_FILE = customPath("data/seasons-seed.json");
const MAIN_DATA_FILE = customPath("data/main-seed.json");
const SEASONS_DATA = JSON.parse(fs.readFileSync(SEASONS_DATA_FILE, "utf8"));
const TASKS_DATA = JSON.parse(fs.readFileSync(TASKS_DATA_FILE, "utf8"));
const MAIN_DATA = JSON.parse(fs.readFileSync(MAIN_DATA_FILE, "utf8"));

const SELECTED_CHAIN =
  process.env.CHAIN == null ? "mainnet" : process.env.CHAIN;
const config = {
  tasks: {
    // ICON tasks
    depositSicxICON: "DEPOSIT_SICX_COLLATERAL_ICON",
    mintingBnusdICON: "MINTING_BNUSD_ICON",
    lockingSavingsRateICON: "LOCKING_SAVINGS_RATE_ICON",
    // AVAX tasks
    depositAvaxCollateral: "DEPOSIT_AVAX_COLLATERAL_ICON",
    // Stellar tasks
    depositStellarCollateral: "DEPOSIT_NATIVE_STELLAR_COLLATERAL",
    mintingBnusdStellar: "MINTING_BNUSD_STELLAR",
    //crosschain tasks
    depositNativeCrossChain: "DEPOSIT_NATIVE_CROSSCHAIN_COLLATERAL",
    mintingBnusdCrossChain: "MINTING_BNUSD_CROSSCHAIN",
    dailyCheckInCrossChain: "DAILY_CHECK_IN_CROSS_CHAIN_COLLATERAL",
    // SUI tasks
    depositNativeSui: "DEPOSIT_NATIVE_SUI_COLLATERAL",
    depositMSui: "DEPOSIT_M_SUI_COLLATERAL",
    mintingBnusdSui: "MINTING_BNUSD_SUI",
    mintingBnusdMSui: "MINTING_BNUSD_M_SUI",
    dailyCheckInSui: "DAILY_CHECK_IN_SUI_COLLATERAL",
    // General tasks
    registerNewUser: "REGISTER_NEW_USER",
    usingReferralCode: "USING_REFERRAL_CODE",
    referringUser: "REFERRING_USER",
    hanaNewsletter: "HANA_NEWSLETTER",
    linkTwitterX: "LINK_TWITTER_X",
    linkGoogle: "LINK_GOOGLE",
  },
  chains: {
    evm: [
      "0x2105.base",
      "0x38.bsc",
      "0x89.polygon",
      "0xa.optimism",
      "0xa4b1.arbitrum",
      "0xa86a.avax",
    ],
  },
  tokens: {
    avax: "AVAX",
    bnb: "BNB",
    btc: "BTC",
    btcb: "BTCB",
    eth: "ETH",
    inj: "INJ",
    sicx: "sICX",
    tbtc: "tBTC",
    weeth: "weETH",
    wsteth: "wstETH",
    bnusd: "bnUSD",
  },
  seeds: {
    seasons: SEASONS_DATA,
    tasks: TASKS_DATA,
    main: MAIN_DATA,
    test: {
      season: SEASONS_DATA,
    },
  },
  misc: {
    termPeriod: 43200,
    lineBreak: "\n------------------------------------",
  },
  ports: {
    dbManager: process.env.DB_MANAGER_PORT,
  },
  collections: {
    users: process.env.USER_COLLECTION,
    task: process.env.TASK_COLLECTION,
    season: process.env.SEASON_COLLECTION,
    userTask: process.env.USER_TASK_COLLECTION,
    referrals: process.env.REFERRALS_COLLECTION ?? "referral",
    dailyCheckIn: process.env.DAILY_CHECK_IN_COLLECTION ?? "daily_check_in",
  },
  db: {
    user: process.env.MONGO_USER,
    pwd: process.env.MONGO_PASSWORD,
    port: process.env.MONGO_PORT,
    dbName: process.env.MONGO_DB_NAME,
    containerName: process.env.MONGO_CONTAINER,
  },
  flags: {
    forceUpdateTasks: process.env.FORCE_UPDATE_TASKS === "true" || false,
    forceUpdateSeasons: process.env.FORCE_UPDATE_SEASONS === "true" || false,
  },
  jvm: {
    routes: {
      v3: "/api/v3",
    },
    mainnet: {
      rpc: "https://ctz.solidwallet.io/api/v3",
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
    devnet: {
      rpc: "https://tt.net.solidwallet.io/jvm-rpc/api/v3",
      nid: 3,
      contracts: {
        chain: "cx0000000000000000000000000000000000000000",
        registrationBook: null,
        balanced: {
          savings: null,
          loans: null,
        },
      },
    },
    lisbon: {
      rpc: "https://lisbon.net.solidwallet.io/api/v3",
      nid: 2,
      contracts: {
        chain: "cx0000000000000000000000000000000000000000",
        registrationBook: "cx095c4e2fbacc1d5268c16a1ef6232290b1db0d8d",
        balanced: {
          savings: null,
          loans: null,
        },
      },
    },
  },
  seasonsRoutes: {
    "mirai-season": 1,
    // uncomment these during testing
    // test1: "1",
    // test2: "2",
    // test3: "3",
    // test4: "4",
    // test5: "5",
    // test6: "6",
  },
  mongoParams: {},
};

config.jvm.default = config.jvm[SELECTED_CHAIN];

const mongoContainer =
  process.env.NODE_ENV === "dev"
    ? "localhost"
    : config.db.containerName == null
      ? "mongodb"
      : config.db.containerName;

config.mongoParams.uri =
  process.env.USE_LOCALHOST === true || process.env.USE_LOCALHOST === "true"
    ? "mongodb://127.0.0.1:27017"
    : `mongodb://${config.db.user}:${config.db.pwd}@${mongoContainer}:${config.db.port}`;

module.exports = config;
