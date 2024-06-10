const { userService, seasonService } = require("../../common/services/v1");
const { createUser, getAllUsers } = userService;
const { getActiveSeason } = seasonService;
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

    const activeSeasonArr = await getActiveSeason(db.connection);

    if (activeSeasonArr.length === 0) {
      throw new Error("No active season found");
    }

    // Fetch users in DB
    console.log("Fetching users from DB");
    const usersInDb = await getAllUsers(db.connection);

    const usersDict = {};
    for (const season of activeSeasonArr) {
      // TODO: fetch users from all the smart contracts
      // and create an array with non repeating users
      // Fetch users from RPC API.
      // if season has ended bypass that season
      console.log("Fetching users from RPC API");
      const usersFromRpc = await getUsersList(null, season.contract);

      console.log("Fetching registration block for each user");
      for (const user of usersFromRpc) {
        console.log("Fetching registration block for user: ", user);
        const registrationBlock = await getUserRegistrationBlock(
          user,
          null,
          season.contract,
        );
        if (isValidHex(registrationBlock)) {
          usersDict[user] = {
            walletAddress: user,
            registrationBlock: parseInt(registrationBlock, 16),
            updatedAtBlock: parseInt(registrationBlock, 16),
          };
        }
      }
    }

    // DEBUG PRINT
    // console.log("users from rpc");
    // console.log(usersDict);

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
