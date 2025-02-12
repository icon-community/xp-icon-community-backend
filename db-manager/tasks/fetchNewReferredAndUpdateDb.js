// This task is defined for the purpose of fetching new
// referred from the database and allocating the
// earned XP
//
const genericTask = require("./genericTask");
const { tasks } = require("../common/utils/config");
const SEED_ID = tasks.usingReferralCode;

function dummy(...params) {
  void params;
  return null;
}

async function fetchNewReferredAndUpdateDb(taskInput, db) {
  try {
    console.log("========");
    console.log("> Running fetchNewReferredAndUpdateDb task");
    return await genericTask(taskInput, db, SEED_ID, dummy);
  } catch (err) {
    console.log("Error running fetchNewReferredAndUpdateDb task");
    console.log(err);
  }
}

module.exports = fetchNewReferredAndUpdateDb;
