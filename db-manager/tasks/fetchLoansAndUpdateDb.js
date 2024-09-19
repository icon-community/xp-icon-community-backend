// This task is defined for the purpose of fetching loans (debt) from the blockchain and updating the database with the latest debt amounts.
// This task is hardcoded to run with a task with a
// task id in the seed labeled as "t2" (seedId === "t2");
const SEED_ID = "t2";
const genericTask = require("./genericTask");
const { getTotalDebtInUSDValue } = require("../common/utils/json-rpc-services");

async function fetchLoansAndUpdateDb(taskInput, db) {
  try {
    console.log("========");
    console.log("> Running fetchLoansAndUpdateDb task");
    return await genericTask(taskInput, db, SEED_ID, getTotalDebtInUSDValue);
  } catch (err) {
    console.log("Error running fetchLoansAndUpdateDb task");
    console.log(err);
  }
}

module.exports = fetchLoansAndUpdateDb;
