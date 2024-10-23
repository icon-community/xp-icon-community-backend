// This task is defined for the purpose of fetching
// cross chain loans (debt) from the blockchain and
// updating the database with the latest debt amounts.
// This task is hardcoded to run with a task with a
// task id in the seed labeled as "t7" (seedId === "t7");
const SEED_ID = "t7";
const genericTask = require("./genericTask");
const {
  getXChainDebtInUSDValue,
} = require("../common/utils/json-rpc-services");

async function fetchXChainLoansAndUpdateDb(taskInput, db) {
  try {
    console.log("========");
    console.log("> Running fetchXChainLoansAndUpdateDb task");
    return await genericTask(taskInput, db, SEED_ID, getXChainDebtInUSDValue);
  } catch (err) {
    console.log("Error running fetchXChainLoansAndUpdateDb task");
    console.log(err);
  }
}

module.exports = fetchXChainLoansAndUpdateDb;
