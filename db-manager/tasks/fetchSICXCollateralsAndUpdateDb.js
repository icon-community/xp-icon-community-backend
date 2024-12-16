// This task is defined for the purpose of fetching collaterals from the blockchain and updating the database with the latest collateral amounts.
const genericTask = require("./genericTask");
const { tasks } = require("../common/utils/config");
const SEED_ID = tasks.depositSicxICON;
const {
  getSICXCollateralInUSDValue,
} = require("../common/utils/json-rpc-services");

async function fetchSICXCollateralsAndUpdateDb(taskInput, db) {
  try {
    console.log("========");
    console.log("> Running fetchSICXCollateralsAndUpdateDb task");
    return await genericTask(
      taskInput,
      db,
      SEED_ID,
      getSICXCollateralInUSDValue,
    );
  } catch (err) {
    console.log("Error running fetchSICXCollateralsAndUpdateDb task");
    console.log(err);
  }
}

module.exports = fetchSICXCollateralsAndUpdateDb;
