//
const Monitor = require("./utils/monitor");
const { JVM_SERVICE, IconBuilder, taskRunner } = require("./utils/utils");
const MainDb = require("../utils/mainDb");
const {
  fetchRegisteredUsersAndUpdateDb,
  fetchCollateralsAndUpdateDb,
  fetchLoansAndUpdateDb,
  fetchLockedSavingsAndUpdateDb,
} = require("./tasks");
const INIT_BLOCK_HEIGHT = parseInt(process.env.BLOCK);
const RUN_TIME = parseInt(process.env.TIME);
const NO_TASK_RUN = process.env.NO_TASK == null ? false : true;
const CHAIN = process.env.CHAIN;
void CHAIN;

const db = new MainDb();

if (Number.isNaN(INIT_BLOCK_HEIGHT)) {
  throw new Error("Invalid block height");
}

// Array of tasks that will be run by the monitor. these
// task are run in the order they are added to the array
const tasks = [];

// first run task that fetches registered users and updates the db
tasks.push(taskRunner(fetchRegisteredUsersAndUpdateDb, db));

// Run task that fetches collateral deposited by each user and updates the db

tasks.push(taskRunner(fetchCollateralsAndUpdateDb, db));

// Run task that fetches loans taken by each user and updates the db
tasks.push(taskRunner(fetchLoansAndUpdateDb, db));

// Run task that fetches locked savings by each user and updates the db
tasks.push(taskRunner(fetchLockedSavingsAndUpdateDb, db));

// Create a monitor instance
const monitor = new Monitor(
  JVM_SERVICE,
  tasks,
  IconBuilder,
  INIT_BLOCK_HEIGHT,
  NO_TASK_RUN,
);

async function main() {
  // start monitor
  monitor.start();

  if (RUN_TIME != null && !Number.isNaN(RUN_TIME)) {
    // run monitor for specified time
    setTimeout(() => {
      monitor.stop();
    }, RUN_TIME * 1000);
  }
}

// catch uncought exceptions
process.on("uncaughtException", (err) => {
  console.log("!!!!! Uncaught exception: ");
  console.log(err);
  db.stop();
  monitor.stop();
  process.exit(1);
});

// Enable graceful stop
process.once("SIGINT", () => {
  db.stop();
  monitor.stop();
  process.exit();
});

process.once("SIGTERM", () => {
  db.stop();
  monitor.stop();
  process.exit();
});

// Start the main function
main();
