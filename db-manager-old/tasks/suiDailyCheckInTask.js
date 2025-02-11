// Daily check in task using consecutive streak count and deposited cross-chain/sui collateral to calculate daily xp
const dailyCheckInTask = require("./dailyCheckInTask");

/*
 * (amount)*(multiplier/10)
 */
function rewardCalculator(amount, multiplier) {
  const result = (amount * multiplier) / 10;
  return result;
}

async function suiDailyCheckInTask(taskInput, db) {
  try {
    return await dailyCheckInTask(taskInput, db, "sui", rewardCalculator);
  } catch (err) {
    console.error("Error running suiDailyCheckInTask");
    console.log(err);
  }
}

module.exports = suiDailyCheckInTask;
