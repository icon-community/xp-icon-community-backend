require("dotenv").config();

const SELECTED_CHAIN =
  process.env.CHAIN == null ? "mainnet" : process.env.CHAIN;
const config = {
  ports: {
    backend: process.env.REST_PORT,
    dbManager: process.env.DB_MANAGER_PORT,
  },
  collections: {
    users: process.env.USERS_COLLECTION,
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
    mainnet: {
      rpc: "https://ctz.solidwallet.io/api/v3",
      nid: 1,
      contracts: {
        chain: "cx0000000000000000000000000000000000000000",
      },
    },
    lisbon: {
      rpc: "https://lisbon.net.solidwallet.io/api/v3",
      nid: 2,
      contracts: {
        chain: "cx0000000000000000000000000000000000000000",
      },
    },
  },
};

config.jvm.default = config.jvm[SELECTED_CHAIN];

module.exports = config;
