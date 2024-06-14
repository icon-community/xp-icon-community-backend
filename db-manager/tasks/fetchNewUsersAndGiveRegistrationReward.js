// This task is defined for the purpose of fetching new users
// and giving them registration rewards.
//
// This task is hardcoded to run with a task id in the seed
// labeled as "t4" (seedId === "t4");
const SEED_ID = "t4";
const genericTask = require("./genericTask");

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
