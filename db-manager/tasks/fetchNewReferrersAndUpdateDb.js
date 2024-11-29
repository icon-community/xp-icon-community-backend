// This task is defined for the purpose of fetching new
// referrers from the database and allocating the
// earned XP
//
// This task is hardcoded to run with a task id in the seed
// labeled as "t9" (seedId === "t9");
const SEED_ID = "t9";
const genericTask = require("./genericTask");

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
