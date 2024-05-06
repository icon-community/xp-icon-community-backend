//
// Information about the tasks is saved in a seed file,
// this script reads the seed file and saves the data to the database.
// This file can be run multiple times without duplicating the data.
// The script will check if the data already exists in the database and will not save it again.
// If new data is added to the seed file, the script will save the new data to the database.

const {
  createTask,
  getAllTasks,
} = require("../../common/services/v1/taskService");
const fs = require("fs");
const customPath = require("../../utils/customPath");
const config = require("../../utils/config");
const TASK_SEED = config.seeds.tasks;

async function feedTaskSeedDataToDb(db) {
  console.log("> Running feedTaskSeedDataToDb");
  try {
    console.log("Creating connection to DB");
    await db.createConnection();

    console.log("Reading tasks-seed.json");
    const tasks = JSON.parse(fs.readFileSync(customPath(TASK_SEED), "utf8"));

    // DEBUG PRINT
    // console.log("Tasks in seed file");
    // console.log(tasks);

    const existingTasks = await getAllTasks(db.connection);

    // DEBUG PRINT
    // console.log("Existing tasks in DB");
    // console.log(existingTasks);

    // Compare tasks in seed file with tasks in DB
    // If task does not exist in DB, create it
    console.log("Comparing tasks in seed file with tasks in DB");
    for (let task of tasks) {
      if (!existingTasks.find((t) => t.seedId === task.seedId)) {
        console.log(
          `Task with seedId ${task.seedId} does not exist. Creating...`,
        );
        await createTask(task, db.connection);
        console.log(`Task with seedId ${task.seedId} created`);
      } else {
        console.log(`Task with seedId ${task.seedId} already exists`);
      }
    }

    // DEBUG PRINT
    // const foo = await getAllTasks(db.connection);
    // console.log(foo);

    // Close connection to DB.
    console.log("Closing connection to DB");
    await db.stop();
  } catch (err) {
    // Close connection to DB.
    console.log("Closing connection to DB");
    await db.stop();

    if (err.message != null && err.message === "CRITICAL") {
      throw new Error(err);
    }
    console.log("Error in feedTaskSeedDataToDb:");
    console.log(err);
    throw new Error(err);
  }
}

module.exports = feedTaskSeedDataToDb;
