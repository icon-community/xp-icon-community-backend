const fetchRegisteredUsersAndUpdateDb = require("./fetchRegisteredUsersAndUpdateDb");
const fetchCollateralsAndUpdateDb = require("./fetchCollateralsAndUpdateDb");
const fetchLoansAndUpdateDb = require("./fetchLoansAndUpdateDb");
const fetchLockedSavingsAndUpdateDb = require("./fetchLockedSavingsAndUpdateDb");
const feedTaskSeedDataToDb = require("./feedTaskSeedDataToDb");
const feedSeasonSeedDataToDb = require("./feedSeasonSeedDataToDb");
const fetchNewUsersAndGiveRegistrationReward = require("./fetchNewUsersAndGiveRegistrationReward");

module.exports = {
  fetchRegisteredUsersAndUpdateDb,
  fetchCollateralsAndUpdateDb,
  fetchLoansAndUpdateDb,
  fetchLockedSavingsAndUpdateDb,
  feedTaskSeedDataToDb,
  feedSeasonSeedDataToDb,
  fetchNewUsersAndGiveRegistrationReward,
};
