//
const feedSeasonSeedDataToDb = require("../tasks/feedSeasonSeedDataToDb");
const MainDb = require("../../utils/mainDb");
const config = require("../../utils/config");

const params = {};
if (process.env.MONGO_CONTAINER != null) {
  params.uri = `mongodb://${process.db.user}:${config.db.pwd}@${process.env.MONGO_CONTAINER}:27017`;
}

const db = new MainDb(params);

async function main() {
  try {
    await feedSeasonSeedDataToDb(db);
  } catch (err) {
    console.log("Error in updateSeasons.js:");
    console.log(err);
  }
}

main();
