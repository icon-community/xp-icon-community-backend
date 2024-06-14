const fetchRegisteredUsersAndUpdateDb = require("./fetchRegisteredUsersAndUpdateDb");
const fetchSICXCollateralsAndUpdateDb = require("./fetchSICXCollateralsAndUpdateDb");
const fetchAVAXCollateralsAndUpdateDb = require("./fetchAVAXCollateralsAndUpdateDb");
const fetchLoansAndUpdateDb = require("./fetchLoansAndUpdateDb");
const fetchLockedSavingsAndUpdateDb = require("./fetchLockedSavingsAndUpdateDb");
const feedTaskSeedDataToDb = require("./feedTaskSeedDataToDb");
const feedSeasonSeedDataToDb = require("./feedSeasonSeedDataToDb");
const fetchNewUsersAndGiveRegistrationReward = require("./fetchNewUsersAndGiveRegistrationReward");

module.exports = {
  fetchRegisteredUsersAndUpdateDb,
  fetchSICXCollateralsAndUpdateDb,
  fetchAVAXCollateralsAndUpdateDb,
  fetchLoansAndUpdateDb,
  fetchLockedSavingsAndUpdateDb,
  feedTaskSeedDataToDb,
  feedSeasonSeedDataToDb,
  fetchNewUsersAndGiveRegistrationReward,
};
