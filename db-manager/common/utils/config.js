require("dotenv").config();

const SELECTED_CHAIN =
  process.env.CHAIN == null ? "mainnet" : process.env.CHAIN;
const config = {
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
    seasons: "db-manager/data/seasons-seed.json",
    tasks: "db-manager/data/tasks-seed.json",
    main: "db-manager/data/main-seed.json",
    test: {
      season: "db-manager/data/test-seeds/seasons-seed-test-1.json",
    },
  },
  misc: {
    termPeriod: 43200,
    lineBreak: "\n------------------------------------",
  },
  ports: {
    backend: process.env.REST_PORT,
    dbManager: process.env.DB_MANAGER_PORT,
  },
  collections: {
    users: process.env.USER_COLLECTION,
    task: process.env.TASK_COLLECTION,
    season: process.env.SEASON_COLLECTION,
    userTask: process.env.USER_TASK_COLLECTION,
  },
  db: {
    uri: process.env.URI,
    user: process.env.MONGO_USER,
    pwd: process.env.MONGO_PASSWORD,
  },
  flags: {
    useMockDb: process.env.USE_MOCK_DB,
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
    iconteam: "1",
    ripdao: "2",
    vybzdao: "3",
    mrgryzzly: "4",
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
  process.env.MONGO_CONTAINER == null ? "mongodb" : process.env.MONGO_CONTAINER;

if (process.env.NODE_ENV === "dev") {
  config.mongoParams.uri = `mongodb://${config.db.user}:${config.db.pwd}@localhost:27017`;
} else {
  config.mongoParams.uri = `mongodb://${config.db.user}:${config.db.pwd}@${mongoContainer}:27017`;
}

module.exports = config;
