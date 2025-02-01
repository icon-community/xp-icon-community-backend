// Daily check in task using consecutive streak count and deposited cross-chain/sui collateral to calculate daily xp
const dailyCheckInTask = require("./dailyCheckInTask");

/*
 * (1 + streak count / 100) * (value of deposited collateral in USD / 2)
 */
function rewardCalculator(amount, multiplier) {
  return (1 + multiplier / 100) * (amount / 2);
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
