// This task is defined for the purpose of fetching new
// referred from the database and allocating the
// earned XP
//
// This task is hardcoded to run with a task id in the seed
// labeled as "t8" (seedId === "t8");
const SEED_ID = "t8";
const genericTask = require("./genericTask");

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
