//
const Monitor = require("./utils/monitor");
const { JVM_SERVICE, IconBuilder } = require("./utils/utils");
const MockDb = require("../utils/mockDb");
const MainDb = require("../utils/mainDb");
const { fetchRegisteredUsersAndUpdateDb } = require("./tasks");

const USE_MOCK_DB = false;
const db = USE_MOCK_DB ? new MockDb() : new MainDb();
const INIT_BLOCK_HEIGHT = 80670350;

const tasks = [];
tasks.push(taskRunner(fetchRegisteredUsersAndUpdateDb, db));
const monitor = new Monitor(JVM_SERVICE, tasks, IconBuilder, INIT_BLOCK_HEIGHT);

function taskRunner(task, db = db) {
  return async (input) => await task(input, db);
}

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
