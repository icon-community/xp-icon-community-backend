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

const db = new MainDb();

const INIT_BLOCK_HEIGHT = parseInt(process.env.BLOCK);
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
const monitor = new Monitor(JVM_SERVICE, tasks, IconBuilder, INIT_BLOCK_HEIGHT);

async function main() {
  // start monitor
  monitor.start();

  // run monitor for 20 seconds
  setTimeout(() => {
    monitor.stop();
  }, 60000);
}

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
