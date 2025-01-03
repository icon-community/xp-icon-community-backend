// This task is defined for the purpose of fetching
// cross chain loans (debt) from the blockchain and
// updating the database with the latest debt amounts.
const genericTask = require("./genericTask");
const { tasks } = require("../common/utils/config");
const SEED_ID = tasks.mintingBnusdSui;
const {
  getSuiXChainDebtInUSDValue,
} = require("../common/utils/json-rpc-services");

async function fetchSuiXChainLoansAndUpdateDb(taskInput, db) {
  try {
    console.log("========");
    console.log("> Running fetchSuiXChainLoansAndUpdateDb task");
    return await genericTask(taskInput, db, SEED_ID, getSuiXChainDebtInUSDValue);
  } catch (err) {
    console.log("Error running fetchSuiXChainLoansAndUpdateDb task");
    console.log(err);
  }
}

module.exports = fetchSuiXChainLoansAndUpdateDb;
