// This task is defined for the purpose of fetching
// cross chain loans (debt) from the blockchain and
// updating the database with the latest debt amounts.
const genericTask = require("./genericTask");
const { tasks } = require("../common/utils/config");
const SEED_ID = tasks.mintingBnusdCrossChain;
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
