import { MongoConfig } from "../shared/types/ConfigTypes";

const MONGO_CONFIG: MongoConfig = {
  user: process.env.MONGO_USER,
  pwd: process.env.MONGO_PASSWORD,
  port: process.env.MONGO_PORT,
  dbName: process.env.MONGO_DB_NAME,
  containerName: process.env.MONGO_CONTAINER,
  collections: {
    users: process.env.USER_COLLECTION,
    tasks: process.env.TASK_COLLECTION,
    seasons: process.env.SEASON_COLLECTION,
    userTasks: process.env.USER_TASK_COLLECTION,
    referrals: process.env.REFERRALS_COLLECTION,
    dailyCheckIn: process.env.DAILY_CHECK_IN_COLLECTION,
  },
};

const mongoContainer =
  process.env.NODE_ENV === "dev"
    ? "localhost"
    : MONGO_CONFIG.containerName == null
      ? "mongodb"
      : MONGO_CONFIG.containerName;

MONGO_CONFIG.uri =
  process.env.USE_LOCALHOST === "true"
    ? "mongodb://127.0.0.1:27017"
    : `mongodb://${MONGO_CONFIG.user}:${MONGO_CONFIG.pwd}@${mongoContainer}:${MONGO_CONFIG.port}`;

export default MONGO_CONFIG;
