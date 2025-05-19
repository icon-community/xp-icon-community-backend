// Daily check in task using consecutive streak count and deposited cross-chain collateral to calculate daily xp
const dailyCheckInTask = require("./dailyCheckInTask");

/*
 * (amount)*(multiplier/10)
 */
function rewardCalculator(amount, multiplier) {
  const result = (amount * multiplier) / 10;
  return result;
}

async function crossChainDailyCheckInTask(taskInput, db) {
  try {
    return await dailyCheckInTask(taskInput, db, "cross-chain", rewardCalculator);
  } catch (err) {
    console.error("Error running crossChainDailyCheckInTask");
    console.log(err);
  }
}

module.exports = crossChainDailyCheckInTask;
