//
const feedSeasonSeedDataToDb = require("../tasks/feedSeasonSeedDataToDb");
const MainDb = require("../../utils/mainDb");
const config = require("../../utils/config");

const MONGO_CONTAINER =
  process.env.MONG_CONTAINER == null ? "mongodb" : process.env.MONG_CONTAINER;

const params = {};
let seed = null;
if (process.env.NODE_ENV === "dev") {
  params.uri = `mongodb://${config.db.user}:${config.db.pwd}@localhost:27017`;
  seed = config.seeds.test.season;
} else {
  params.uri = `mongodb://${config.db.user}:${config.db.pwd}@${MONGO_CONTAINER}:27017`;
}

const db = new MainDb(params);

async function main() {
  try {
    if (seed === null) {
      await feedSeasonSeedDataToDb(db);
    } else {
      await feedSeasonSeedDataToDb(db, seed);
    }
  } catch (err) {
    console.log("Error in updateSeasons.js:");
    console.log(err);
  }
}

main();
