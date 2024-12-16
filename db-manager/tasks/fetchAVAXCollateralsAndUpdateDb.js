// This task is defined for the purpose of fetching collaterals from the blockchain and updating the database with the latest collateral amounts.
const genericTask = require("./genericTask");
const {
  getAVAXCollateralInUSDValue,
} = require("../common/utils/json-rpc-services");
const { tasks } = require("../common/utils/config");
const SEED_ID = tasks.depositAvaxCollateral;

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
