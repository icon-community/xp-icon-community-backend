//
const feedTaskSeedDataToDb = require("../tasks/feedTaskSeedDataToDb");
const MainDb = require("../../utils/mainDb");
const config = require("../../utils/config");
const MONGO_CONTAINER =
  process.env.MONGO_CONTAINER == null ? "mongodb" : process.env.MONGO_CONTAINER;

const params = {};

if (process.env.NODE_ENV === "dev") {
  params.uri = `mongodb://${config.db.user}:${config.db.pwd}@localhost:27017`;
} else {
  params.uri = `mongodb://${config.db.user}:${config.db.pwd}@${MONGO_CONTAINER}:27017`;
}

const db = new MainDb(params);

async function main() {
  try {
    await feedTaskSeedDataToDb(db);
  } catch (err) {
    console.log("Error in updateTasks.js:");
    console.log(err);
  }
}

main();
