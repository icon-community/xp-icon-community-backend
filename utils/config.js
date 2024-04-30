require("dotenv").config();

const SELECTED_CHAIN =
  process.env.CHAIN == null ? "mainnet" : process.env.CHAIN;
const config = {
  misc: {
    termPeriod: 43200,
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
    lisbon: {
      rpc: "https://lisbon.net.solidwallet.io/api/v3",
      nid: 2,
      contracts: {
        chain: "cx0000000000000000000000000000000000000000",
        registrationBook: "cx095c4e2fbacc1d5268c16a1ef6232290b1db0d8d",
      },
    },
  },
};

config.jvm.default = config.jvm[SELECTED_CHAIN];

module.exports = config;
