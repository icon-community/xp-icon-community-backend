// This task is defined for the purpose of fetching saving rates data from the blockchain and updating the database with the latest data.
const genericTask = require("./genericTask");
const {
  getLockedAmountAsDecimal,
} = require("../common/utils/json-rpc-services");
const { tasks } = require("../common/utils/config");
const SEED_ID = tasks.lockingSavingsRateICON;
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
