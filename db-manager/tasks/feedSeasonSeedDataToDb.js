//NOTE:
// Information about the seasons is saved in a seed file,
// this script reads the seed file and saves the data to the database.
// This file can be run multiple times without duplicating the seasons
// The script will check if the season already exists in the database and will not save it again.
// If new seasons are added to the seed file, the script will save the new season to the database.
// IMPORTANT: The script will not check if the tasks in the season already exist in the database.
// If the tasks do not exist in the database, the script will throw an error and will not save the season.
// New tasks cannot be added to the season after the season has been saved to the database. This means all tasks must be defined in the seed file before running the script.

const {
  createSeason,
  getAllSeasons,
  updateSeason,
} = require("../common/services/v1/seasonService");
const { getAllTasks } = require("../common/services/v1/taskService");
const fs = require("fs");
const customPath = require("../common/utils/customPath");
const config = require("../common/utils/config");
const SEASON_SEED = config.seeds.seasons;

async function feedSeasonSeedDataToDb(db, useSeed = null, update = false) {
  const seed = useSeed == null ? SEASON_SEED : useSeed;
  console.log("> Running feedSeasonSeedDataToDb");
  console.log(`> Seed file: ${seed}`);
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
    // console.log("Existing seasons in DB:");
    // console.log(existingSeasons);

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
    const tasksFromDb = await getAllTasks(db.connection);
    for (let season of seasons) {
      const seasonDoesNotExist = !existingSeasons.find(
        (s) => s.number === season.number,
      );
      if (seasonDoesNotExist || update) {
        const arrOfTasksToSave = [];
        for (let task of season.tasks) {
          const taskToSave = tasksFromDb.find((t) => t.seedId === task);
          if (taskToSave) {
            arrOfTasksToSave.push(taskToSave._id);
          } else {
            console.log(`Task with seedId ${task} not found in DB`);
            throw new Error("CRITICAL");
          }
        }
        season.tasks = [...arrOfTasksToSave];

        if (seasonDoesNotExist) {
          console.log(
            `Season #${season.number} does not exists in DB, saving it`,
          );
          await createSeason(season, db.connection);
          console.log(`Season #${season.number} saved`);
        }
      } else {
        console.log(`Season #${season.number} already exists in DB`);
        if (update) {
          console.log(
            `Season #${season.number} exists in DB but command to update was send, updating it`,
          );

          const seasonToUpdate = existingSeasons.find(
            (s) => s.number === season.number,
          );

          await updateSeason(seasonToUpdate._id, season, db.connection);
          console.log(`Season #${season.number} updated`);
        }
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
