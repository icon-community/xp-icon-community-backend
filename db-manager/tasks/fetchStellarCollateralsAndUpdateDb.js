// This task is defined for the purpose of fetching collaterals from the blockchain and updating the database with the latest collateral amounts.
const genericTask = require("./genericTask");
const {
  getStellarCollateralInUSDValue,
} = require("../common/utils/json-rpc-services");
const { tasks } = require("../common/utils/config");
const SEED_ID = tasks.depositStellarCollateral;

async function fetchStellarCollateralsAndUpdateDb(taskInput, db) {
  try {
    console.log("========");
    console.log("> Running fetchStellarCollateralsAndUpdateDb task");
    return await genericTask(
      taskInput,
      db,
      SEED_ID,
      getStellarCollateralInUSDValue,
    );
  } catch (err) {
    console.log("Error running fetchStellarCollateralsAndUpdateDb task");
    console.log(err);
  }
}

module.exports = fetchStellarCollateralsAndUpdateDb;
