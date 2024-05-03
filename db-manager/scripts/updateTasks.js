//
const feedTaskSeedDataToDb = require("../tasks/feedTaskSeedDataToDb");
const MainDb = require("../../utils/mainDb");

const db = new MainDb();

async function main() {
  try {
    await feedTaskSeedDataToDb(db);
  } catch (err) {
    console.log("Error in updateTasks.js:");
    console.log(err);
  }
}

main();
