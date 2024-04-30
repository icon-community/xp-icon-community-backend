const {
  createUser,
  getAllUsers,
} = require("../../rest-server/services/v1/userService");
const { getUsersList } = require("../utils/json-rpc-services");

async function fetchRegisteredUsersAndUpdateDb(input, db) {
  console.log("input");
  console.log(input.height);

  // Create connection to DB.
  await db.createConnection();

  // Fetch users from RPC API.
  const usersFromRpc = await getUsersList();
  console.log("users from rpc");
  console.log(usersFromRpc);

  // Fetch users in DB
  const usersInDb = await getAllUsers(db.connection);
  console.log("users in db");
  console.log(usersInDb);

  // Compare users from RPC API and DB.
  // If user is not in DB, insert user into DB.
  // const users = await fetchUsers();
  // await updateDb(users);

  // Close connection to DB.
  await db.stop();
}

module.exports = fetchRegisteredUsersAndUpdateDb;
