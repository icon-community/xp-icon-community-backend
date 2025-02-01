const fetchRegisteredUsersAndUpdateDb = require("./fetchRegisteredUsersAndUpdateDb");
const fetchSICXCollateralsAndUpdateDb = require("./fetchSICXCollateralsAndUpdateDb");
const fetchAVAXCollateralsAndUpdateDb = require("./fetchAVAXCollateralsAndUpdateDb");
const fetchLoansAndUpdateDb = require("./fetchLoansAndUpdateDb");
const fetchLockedSavingsAndUpdateDb = require("./fetchLockedSavingsAndUpdateDb");
const feedTaskSeedDataToDb = require("./feedTaskSeedDataToDb");
const feedSeasonSeedDataToDb = require("./feedSeasonSeedDataToDb");
const fetchNewUsersAndGiveRegistrationReward = require("./fetchNewUsersAndGiveRegistrationReward");
const fetchXChainLoansAndUpdateDb = require("./fetchXChainLoansAndUpdateDb");
const fetchXChainCollateralsAndUpdateDb = require("./fetchXChainCollateralsAndUpdateDb");
const fetchSuiXChainLoansAndUpdateDb = require("./fetchSuiXChainLoansAndUpdateDb");
const fetchSuiXChainCollateralsAndUpdateDb = require("./fetchSuiXChainCollateralsAndUpdateDb");
const fetchMSuiXChainLoansAndUpdateDb = require("./fetchmSuiXChainLoansAndUpdateDb");
const fetchMSuiXChainCollateralsAndUpdateDb = require("./fetchmSuiXChainCollateralsAndUpdateDb");
const fetchNewReferrersAndUpdateDb = require("./fetchNewReferrersAndUpdateDb");
const fetchNewReferredAndUpdateDb = require("./fetchNewReferredAndUpdateDb");
const suiDailyCheckInTask = require("./suiDailyCheckInTask");

module.exports = {
  fetchRegisteredUsersAndUpdateDb,
  fetchSICXCollateralsAndUpdateDb,
  fetchAVAXCollateralsAndUpdateDb,
  fetchLoansAndUpdateDb,
  fetchLockedSavingsAndUpdateDb,
  feedTaskSeedDataToDb,
  feedSeasonSeedDataToDb,
  fetchNewUsersAndGiveRegistrationReward,
  fetchXChainLoansAndUpdateDb,
  fetchXChainCollateralsAndUpdateDb,
  fetchSuiXChainLoansAndUpdateDb,
  fetchSuiXChainCollateralsAndUpdateDb,
  fetchMSuiXChainLoansAndUpdateDb,
  fetchMSuiXChainCollateralsAndUpdateDb,
  fetchNewReferrersAndUpdateDb,
  fetchNewReferredAndUpdateDb,
  suiDailyCheckInTask,
};
