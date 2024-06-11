//
// Information about the seasons is saved in a seed file,
// this script reads the seed file and saves the data to the database.
// This file can be run multiple times without duplicating the data.
// The script will check if the data already exists in the database and will not save it again.
// If new data is added to the seed file, the script will save the new data to the database.

const {
  createSeason,
  getAllSeasons,
} = require("../../common/services/v1/seasonService");
const { getAllTasks } = require("../../common/services/v1/taskService");
const fs = require("fs");
const customPath = require("../../utils/customPath");
const config = require("../../utils/config");
const SEASON_SEED = config.seeds.seasons;

async function feedSeasonSeedDataToDb(db, seed = SEASON_SEED) {
  console.log("> Running feedSeasonSeedDataToDb");
  try {
    console.log("Creating connection to DB");
    await db.createConnection();

    console.log("Reading seasons seed file");
    // const seasons = JSON.parse(
    //   fs.readFileSync(customPath(seed)),
    //   "utf8",
    // );
    const seasons = JSON.parse(fs.readFileSync(customPath(seed), "utf8"));

    // DEBUG PRINT
    // console.log("Seasons seed data:");
    // console.log(seasons);

    const existingSeasons = await getAllSeasons(db.connection);

    // DEBUG PRINT
    console.log("Existing seasons in DB:");
    console.log(existingSeasons);

    // Compare seasons in seed file with seasons in DB
    // if season is not in DB, save it
    console.log("Comparing seasons in seed file with seasons in DB");
    // TODO: fetch all the tasks, validate that the tasks
    // with the specified seedId (of the task) have already
    // been created in the DB
    // if not, throw an error
    // if yes, then fetch the tasks mongoId and save it
    // in the entry for the season

    // Get All tasks
    console.log("Fetching all tasks");
    const tasks = await getAllTasks(db.connection);
    for (let season of seasons) {
      if (!existingSeasons.find((s) => s.number === season.number)) {
        console.log(
          `Season #${season.number} doesnt not exists in DB, saving it`,
        );
        const tasksToSave = [];
        for (let task of season.tasks) {
          const taskToSave = tasks.find((t) => t.seedId === task);
          if (taskToSave) {
            tasksToSave.push(taskToSave._id);
          } else {
            console.log(`Task with seedId ${task} not found in DB`);
            throw new Error("CRITICAL");
          }
        }
        season.tasks = tasksToSave;
        await createSeason(season, db.connection);
        console.log(`Season #${season.number} saved`);
      } else {
        console.log(`Season #${season.number} already exists in DB`);
      }
    }

    // DEBUG PRINT
    // const foo = await getAllSeasons(db.connection);
    // console.log(foo);

    // Close connection to DB
    console.log("Closing connection to DB");
    await db.stop();
  } catch (err) {
    // Close connection to DB
    console.log("Closing connection to DB");
    await db.stop();

    if (err.message != null && err.message === "CRITICAL") {
      throw new Error(err);
    }

    console.log("Error in feedSeasonSeedDataToDb");
    console.log(err);
    throw new Error(err);
  }
}

module.exports = feedSeasonSeedDataToDb;
