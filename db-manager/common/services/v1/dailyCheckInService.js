//
const config = require("../../utils/config");
const DAILY_CHECK_IN = config.collections.dailyCheckIn;
const {
  getEntryByParam,
} = require("./common");

async function getUserDailyCheckIn(userId, connection) {
  return await getEntryByParam({ _id: userId }, DAILY_CHECK_IN, connection);
}

module.exports = {
  getUserDailyCheckIn,
};
