// This task is defined for the purpose of fetching new users
// and giving them registration rewards.
//
const genericTask = require("./genericTask");
const { tasks } = require("../common/utils/config");
const SEED_ID = tasks.registerNewUser;

function dummy(...params) {
  void params;
  return null;
}

async function fetchNewUsersAndGiveRegistrationReward(taskInput, db) {
  try {
    console.log("========");
    console.log("> Running fetchNewUsersAndGiveRegistrationReward task");
    return await genericTask(taskInput, db, SEED_ID, dummy);
  } catch (err) {
    console.log("Error running fetchNewUsersAndGiveRegistrationReward task");
    console.log(err);
  }
}

module.exports = fetchNewUsersAndGiveRegistrationReward;
