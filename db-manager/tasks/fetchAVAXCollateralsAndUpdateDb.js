// This task is defined for the purpose of fetching collaterals from the blockchain and updating the database with the latest collateral amounts.
// This task is hardcoded to run with a task with a
// task id in the seed labeled as "t5" (seedId === "t5");
const SEED_ID = "t5";
const genericTask = require("./genericTask");
const { getAVAXCollateralInUSDValue } = require("../common/utils/json-rpc-services");

async function fetchAVAXCollateralsAndUpdateDb(taskInput, db) {
  try {
    console.log("========");
    console.log("> Running fetchAVAXCollateralsAndUpdateDb task");
    return await genericTask(
      taskInput,
      db,
      SEED_ID,
      getAVAXCollateralInUSDValue,
    );
  } catch (err) {
    console.log("Error running fetchAVAXCollateralsAndUpdateDb task");
    console.log(err);
  }
}

module.exports = fetchAVAXCollateralsAndUpdateDb;
