//
const feedTaskSeedDataToDb = require("../tasks/feedTaskSeedDataToDb");
const MainDb = require("../../utils/mainDb");
const config = require("../../utils/config");
const params = { ...config.mongoParams };

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
