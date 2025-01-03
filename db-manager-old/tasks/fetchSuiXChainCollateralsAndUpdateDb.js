// This task is defined for the purpose of fetching cross chain
// collaterals from the blockchain and updating the database
// with the latest collateral amounts.
const genericTask = require("./genericTask");
const { tasks } = require("../common/utils/config");
const SEED_ID = tasks.depositNativeSui;
const {
  getSuiXChainCollateralInUSDValue,
} = require("../common/utils/json-rpc-services");

async function fetchSuiXChainCollateralsAndUpdateDb(taskInput, db) {
  try {
    console.log("========");
    console.log("> Running fetchSuiXChainCollateralsAndUpdateDb task");
    return await genericTask(
      taskInput,
      db,
      SEED_ID,
      getSuiXChainCollateralInUSDValue,
    );
  } catch (err) {
    console.log("Error running fetchSuiXChainCollateralsAndUpdateDb task");
    console.log(err);
  }
}

module.exports = fetchSuiXChainCollateralsAndUpdateDb;
