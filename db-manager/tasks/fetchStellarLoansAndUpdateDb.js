// This task is defined for the purpose of fetching
// cross chain loans (debt) from the blockchain and
// updating the database with the latest debt amounts.
const genericTask = require("./genericTask");
const { tasks } = require("../common/utils/config");
const SEED_ID = tasks.mintingBnusdStellar;
const {
  getStellarDebtInUSDValue,
} = require("../common/utils/json-rpc-services");

async function fetchStellarLoansAndUpdateDb(taskInput, db) {
  try {
    console.log("========");
    console.log("> Running fetchStellarLoansAndUpdateDb task");
    return await genericTask(
      taskInput,
      db,
      SEED_ID,
      getStellarDebtInUSDValue,
    );
  } catch (err) {
    console.log("Error running fetchStellarLoansAndUpdateDb task");
    console.log(err);
  }
}

module.exports = fetchStellarLoansAndUpdateDb;
