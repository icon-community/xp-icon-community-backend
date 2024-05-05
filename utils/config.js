require("dotenv").config();

const SELECTED_CHAIN =
  process.env.CHAIN == null ? "mainnet" : process.env.CHAIN;
const config = {
  seeds: {
    seasons: "db-manager/data/seasons-seed.json",
    tasks: "db-manager/data/tasks-seed.json",
    main: "db-manager/data/main-seed.json",
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
};

config.jvm.default = config.jvm[SELECTED_CHAIN];

module.exports = config;
