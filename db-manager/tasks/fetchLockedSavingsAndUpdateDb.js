// This task is defined for the purpose of fetching saving rates data from the blockchain and updating the database with the latest data.
// This task is hardcoded to run with a task with a
// task id in the seed labeled as "t3" (seedId === "t3");
const SEED_ID = "t3";
const genericTask = require("./genericTask");
const { getLockedAmountAsDecimal } = require("../utils/json-rpc-services");

async function fetchLockedSavingsAndUpdateDb(taskInput, db) {
  try {
    console.log("========");
    console.log("> Running fetchLockedSavingsAndUpdateDb task");
    return await genericTask(taskInput, db, SEED_ID, getLockedAmountAsDecimal);
  } catch (err) {
    console.log("Error running fetchLockedSavingsAndUpdateDb task");
    console.log(err);
  }
}

module.exports = fetchLockedSavingsAndUpdateDb;
