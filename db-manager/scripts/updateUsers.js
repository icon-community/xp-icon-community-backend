//
const fetchRegisteredUsersAndUpdateDb = require("../tasks/fetchRegisteredUsersAndUpdateDb");
const MainDb = require("../common/utils/mainDb");
const config = require("../common/utils/config");

const params = { ...config.mongoParams };

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
