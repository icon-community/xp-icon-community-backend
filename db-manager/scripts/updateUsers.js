//
const fetchRegisteredUsersAndUpdateDb = require("../tasks/fetchRegisteredUsersAndUpdateDb");
const MainDb = require("../../utils/mainDb");
const config = require("../../utils/config");

const MONGO_CONTAINER =
  process.env.MONG_CONTAINER == null ? "mongodb" : process.env.MONG_CONTAINER;

const params = {};
if (process.env.NODE_ENV === "dev") {
  params.uri = `mongodb://${config.db.user}:${config.db.pwd}@localhost:27017`;
} else {
  params.uri = `mongodb://${config.db.user}:${config.db.pwd}@${MONGO_CONTAINER}:27017`;
}

const db = new MainDb(params);

async function main() {
  try {
    await fetchRegisteredUsersAndUpdateDb({ height: 1 }, db);
  } catch (err) {
    console.log("Error in updateUsers.js:");
    console.log(err);
  }
}

main();
