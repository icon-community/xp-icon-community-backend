const {
  createUser,
  getAllUsers,
} = require("../../rest-server/services/v1/userService");
const {
  getUsersList,
  getUserRegistrationBlock,
} = require("../utils/json-rpc-services");
const { isValidHex } = require("../utils/utils");

async function fetchRegisteredUsersAndUpdateDb(taskInput, db) {
  const { height: block } = taskInput;
  console.log(
    `> Running fetchRegisteredUsersAndUpdateDb task on block ${block}`,
  );
  try {
    // Create connection to DB.
    console.log("Creating connection to DB");
    await db.createConnection();

    // Fetch users from RPC API.
    console.log("Fetching users from RPC API");
    const usersFromRpc = await getUsersList();
    const usersDict = {};

    console.log("Fetching registration block for each user");
    for (const user of usersFromRpc) {
      console.log("Fetching registration block for user: ", user);
      const registrationBlock = await getUserRegistrationBlock(user);
      if (isValidHex(registrationBlock)) {
        usersDict[user] = {
          walletAddress: user,
          registrationBlock: parseInt(registrationBlock, 16),
          updatedAtBlock: parseInt(registrationBlock, 16),
        };
      }
    }

    // DEBUG PRINT
    // console.log("users from rpc");
    // console.log(usersDict);

    // Fetch users in DB
    console.log("Fetching users from DB");
    const usersInDb = await getAllUsers(db.connection);

    // DEBUG PRINT
    // const usersInDbFiltered = usersInDb.map((user) => {
    //   return {
    //     walletAddress: user.walletAddress,
    //     registrationBlock: user.registrationBlock,
    //   };
    // });
    // console.log("users in db");
    // console.log(usersInDbFiltered);

    // Compare users from RPC API and DB.
    // If user is not in DB, insert user into DB.
    console.log("Comparing users from RPC API and DB");
    for (const wallet of usersFromRpc) {
      if (!usersInDb.find((user) => user.walletAddress === wallet)) {
        console.log(`User not in DB, inserting user into DB. User: ${wallet}`);
        const user = usersDict[wallet];
        await createUser(user, db.connection);
      } else {
        console.log(`User already in DB. User: ${wallet}`);
      }
    }

    // Close connection to DB.
    console.log("Closing connection to DB");
    await db.stop();
  } catch (err) {
    console.log("Error in fetchRegisteredUsersAndUpdateDb");
    console.log(err);

    // Close connection to DB.
    console.log("Closing connection to DB");
    await db.stop();
    throw new Error(err);
  }
}

module.exports = fetchRegisteredUsersAndUpdateDb;
