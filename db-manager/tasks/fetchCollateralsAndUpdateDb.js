// This task is defined for the purpose of fetching collaterals from the blockchain and updating the database with the latest collateral amounts.
// This task is hardcoded to run with a task with a
// task id in the seed labeled as "t1" (seedId === "t1");
const SEED_ID = "t1";
const genericTask = require("./genericTask");
const { getSicxCollateralInUSDValue } = require("../utils/json-rpc-services");

async function fetchCollateralsAndUpdateDb(taskInput, db) {
  try {
    console.log("========");
    console.log("> Running fetchCollateralsAndUpdateDb task");
    return await genericTask(
      taskInput,
      db,
      SEED_ID,
      getSicxCollateralInUSDValue,
    );
  } catch (err) {
    console.log("Error running fetchCollateralsAndUpdateDb task");
    console.log(err);
  }
}

module.exports = fetchCollateralsAndUpdateDb;
