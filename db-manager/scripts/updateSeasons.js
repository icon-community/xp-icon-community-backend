//
const feedSeasonSeedDataToDb = require("../tasks/feedSeasonSeedDataToDb");
const MainDb = require("../../utils/mainDb");

const db = new MainDb();

async function main() {
  try {
    await feedSeasonSeedDataToDb(db);
  } catch (err) {
    console.log("Error in updateSeasons.js:");
    console.log(err);
  }
}

main();
