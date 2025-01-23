const genericTask = require('./genericTask');
const { tasks } = require('../common/utils/config');
const SEED_ID = tasks.depositMSui;
const {
  getmSuiXChainCollateralInUSDValue,
} = require('../common/utils/json-rpc-services');

async function fetchMSuiXChainCollateralsAndUpdateDb(taskInput, db) {
  try {
    console.log('========');
    console.log('> Running fetchMSuiXChainCollateralsAndUpdateDb task');
    return await genericTask(
      taskInput,
      db,
      SEED_ID,
      getmSuiXChainCollateralInUSDValue,
    );
  } catch (err) {
    console.log('Error running fetchMSuiXChainCollateralsAndUpdateDb task');
    console.log(err);
  }
}

module.exports = fetchMSuiXChainCollateralsAndUpdateDb;
