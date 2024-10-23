// This task is defined for the purpose of fetching cross chain
// collaterals from the blockchain and updating the database
// with the latest collateral amounts.
// This task is hardcoded to run with a task with a
// task id in the seed labeled as "t6" (seedId === "t6");
const SEED_ID = "t6";
const genericTask = require("./genericTask");
const {
  getXChainCollateralInUSDValue,
} = require("../common/utils/json-rpc-services");

async function fetchXChainCollateralsAndUpdateDb(taskInput, db) {
  try {
    console.log("========");
    console.log("> Running fetchXChainCollateralsAndUpdateDb task");
    return await genericTask(
      taskInput,
      db,
      SEED_ID,
      getXChainCollateralInUSDValue,
    );
  } catch (err) {
    console.log("Error running fetchXChainCollateralsAndUpdateDb task");
    console.log(err);
  }
}

module.exports = fetchXChainCollateralsAndUpdateDb;
