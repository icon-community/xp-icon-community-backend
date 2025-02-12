//
const config = require("../../utils/config");
const DAILY_CHECK_IN = config.collections.dailyCheckIn;
const { getEntryByParam } = require("./common");

async function getUserDailyCheckInByWalletAddress(walletAddress, connection) {
  return await getEntryByParam(
    { walletAddress: walletAddress },
    DAILY_CHECK_IN,
    connection,
  );
}

module.exports = {
  getUserDailyCheckInByWalletAddress,
};
