//
const Monitor = require("./utils/monitor");
const { JVM_SERVICE, IconBuilder, taskRunner } = require("./utils/utils");
const MainDb = require("../utils/mainDb");
const {
  fetchRegisteredUsersAndUpdateDb,
  fetchCollateralAndUpdateDb,
  fetchLoansAndUpdateDb,
  fetchLockedSavingsAndUpdateDb,
} = require("./tasks");

const db = new MainDb();
const INIT_BLOCK_HEIGHT = 80670350;

// Array of tasks that will be run by the monitor. these
// task are run in the order they are added to the array
const tasks = [];

// first run task that fetches registered users and updates the db
tasks.push(taskRunner(fetchRegisteredUsersAndUpdateDb, db));

// Run task that fetches collateral deposited by each user and updates the db

tasks.push(taskRunner(fetchCollateralAndUpdateDb, db));

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
  }, 20000);
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
