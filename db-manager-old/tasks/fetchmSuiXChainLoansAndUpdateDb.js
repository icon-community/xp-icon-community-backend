// This task is defined for the purpose of fetching
// cross chain loans (debt) from the blockchain and
// updating the database with the latest debt amounts.
const genericTask = require("./genericTask");
const { tasks } = require("../common/utils/config");
const SEED_ID = tasks.mintingBnusdMSui;
const {
  getmSuiXChainDebtInUSDValue,
} = require("../common/utils/json-rpc-services");

async function fetchMSuiXChainLoansAndUpdateDb(taskInput, db) {
  try {
    console.log("========");
    console.log("> Running fetchMSuiXChainLoansAndUpdateDb task");
    return await genericTask(
      taskInput,
      db,
      SEED_ID,
      getmSuiXChainDebtInUSDValue,
    );
  } catch (err) {
    console.log("Error running fetchMSuiXChainLoansAndUpdateDb task");
    console.log(err);
  }
}

module.exports = fetchMSuiXChainLoansAndUpdateDb;
