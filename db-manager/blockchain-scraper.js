//
const Monitor = require("./utils/monitor");
const {
  JVM_SERVICE,
  IconBuilder,
  taskRunner,
  getInitBlock,
} = require("./common/utils/utils");
const MainDb = require("./common/utils/mainDb");
const {
  fetchRegisteredUsersAndUpdateDb,
  fetchSICXCollateralsAndUpdateDb,
  fetchAVAXCollateralsAndUpdateDb,
  fetchLoansAndUpdateDb,
  fetchLockedSavingsAndUpdateDb,
  feedTaskSeedDataToDb,
  feedSeasonSeedDataToDb,
  fetchNewUsersAndGiveRegistrationReward,
  fetchXChainLoansAndUpdateDb,
  fetchXChainCollateralsAndUpdateDb,
} = require("./tasks");
const config = require("./common/utils/config");

const lineBreak = config.misc.lineBreak;
const RUN_TIME = parseInt(process.env.TIME);
const NO_TASK_RUN = process.env.NO_TASK == null ? false : true;
// const CHAIN = process.env.CHAIN;
// void CHAIN;

// instantiate variables
let monitor = null;
let db = null;

async function main() {
  try {
    // initiate db class
    const params = { ...config.mongoParams };

    // use the season seed data from the seed file.
    // this param can be customized in the file:
    // docker-compose-dev.yml
    // set the environment variable USE_PROD_SEASON to true
    // to use the same seed file as production, or set it
    // to false to use the test seed file
    const seasonSeed =
      process.env.USE_TEST_SEASON === "true"
        ? config.seeds.test.season
        : config.seeds.seasons;

    db = new MainDb(params);

    // read task seed data from file and feed it to the db
    console.log(lineBreak);
    await feedTaskSeedDataToDb(db);

    // read season seed data from file and feed it to the db
    console.log(lineBreak);
    await feedSeasonSeedDataToDb(db, seasonSeed);

    // get init block from seed or db
    console.log(lineBreak);
    const initBlockFromSeed = await getInitBlock(db);

    // get the initial block height from the environment variable
    const initBlockFromEnv = process.env.BLOCK;

    // if the block height is define in the env variable
    // use that value, otherwise try and get the block
    // from the seed file, if that fails throw an error
    // of type "CRITICAL"

    let INIT_BLOCK_HEIGHT;
    if (initBlockFromEnv != null) {
      console.log(
        `Using block height from environment variable. block: ${initBlockFromEnv}`,
      );
      INIT_BLOCK_HEIGHT = parseInt(initBlockFromEnv);
    } else {
      console.log(
        `Using block height fetched from seed file or database. block: ${initBlockFromSeed}`,
      );
      INIT_BLOCK_HEIGHT = initBlockFromSeed;
    }

    if (Number.isNaN(INIT_BLOCK_HEIGHT)) {
      console.log("Invalid block height");
      throw new Error("CRITICAL");
    }
    // Array of tasks that will be run by the monitor. these
    // task are run in the order they are added to the array
    const tasks = [];

    // first run task that fetches registered users and updates the db
    tasks.push(taskRunner(fetchRegisteredUsersAndUpdateDb, db));

    // run task that gives reward for newly registered users
    tasks.push(taskRunner(fetchNewUsersAndGiveRegistrationReward, db));

    // Run task that fetches collateral deposited by each user and updates the db

    tasks.push(taskRunner(fetchSICXCollateralsAndUpdateDb, db));
    tasks.push(taskRunner(fetchAVAXCollateralsAndUpdateDb, db));

    // Run task that fetches loans taken by each user and updates the db
    tasks.push(taskRunner(fetchLoansAndUpdateDb, db));

    // Run task that fetches locked savings by each user and updates the db
    tasks.push(taskRunner(fetchLockedSavingsAndUpdateDb, db));

    // Run task that fetches cross chain loans taken by each user and updates the db
    tasks.push(taskRunner(fetchXChainLoansAndUpdateDb, db));

    // Run task that fetches cross chain collaterals deposited by each user and updates the db
    tasks.push(taskRunner(fetchXChainCollateralsAndUpdateDb, db));
    // create monitor instance
    monitor = new Monitor(
      JVM_SERVICE,
      tasks,
      IconBuilder,
      INIT_BLOCK_HEIGHT,
      NO_TASK_RUN,
    );
    // start monitor
    console.log(lineBreak);
    monitor.start();

    if (RUN_TIME != null && !Number.isNaN(RUN_TIME)) {
      // run monitor for specified time
      setTimeout(() => {
        monitor.stop();
      }, RUN_TIME * 1000);
    }
  } catch (err) {
    console.log("Error in main function");
    console.log(err);
    throw new Error("CRITICAL");
  }
}

// catch uncought exceptions
process.on("uncaughtException", (err) => {
  console.log("!!!!! Uncaught exception: ");
  console.log(err);

  // overall in the logic of the code a error with
  // message "CRITICAL" is thrown when a critical error
  // is encountered. This error is used to stop the
  // monitor and the db connection
  // This is done to prevent the monitor from running
  // when these type of errors are encountered
  // An example that is currently implemented
  // (file: /rest-server/models/seasons.js) in the
  // schema creation process for the "seasons" is that
  // when the environment variable doesnt have an entry
  // for the Tasks collection a critical error is thrown
  // the reason to throw that error is to prevent the
  // monitor from running if no tasks is associated with
  // the season
  // TODO: this works, but it there might be a better way
  // to implemented this?, maybe?
  if (err.message === "CRITICAL") {
    if (db != null && monitor != null) {
      db.stop();
      monitor.stop();
    }
    process.exit(1);
  }
});

// Enable graceful stop
process.once("SIGINT", () => {
  if (db != null && monitor != null) {
    db.stop();
    monitor.stop();
  }
  process.exit();
});

process.once("SIGTERM", () => {
  if (db != null && monitor != null) {
    db.stop();
    monitor.stop();
  }
  process.exit();
});

// Start the main function
main();
