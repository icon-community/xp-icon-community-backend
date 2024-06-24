//
const feedSeasonSeedDataToDb = require("../tasks/feedSeasonSeedDataToDb");
const MainDb = require("../../utils/mainDb");
const config = require("../../utils/config");

const params = { ...config.mongoParams };
let seed = null;

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
