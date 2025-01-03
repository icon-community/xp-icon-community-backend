// This task is defined for the purpose of fetching new
// referrers from the database and allocating the
// earned XP
//
const genericTask = require("./genericTask");
const { tasks } = require("../common/utils/config");
const SEED_ID = tasks.referringUser;
function dummy(...params) {
  void params;
  return null;
}

async function fetchNewReferrersAndUpdateDb(taskInput, db) {
  try {
    console.log("========");
    console.log("> Running fetchNewReferrersAndUpdateDb task");
    return await genericTask(taskInput, db, SEED_ID, dummy);
  } catch (err) {
    console.log("Error running fetchNewReferrersAndUpdateDb task");
    console.log(err);
  }
}

module.exports = fetchNewReferrersAndUpdateDb;
