const { userService, seasonService } = require("../../common/services/v1");
const { createUser, getAllUsers, addSeasonToUser } = userService;
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
    const walletsOfUsersInDb = usersInDb.map((user) => user.walletAddress);

    for (const season of activeSeasonArr) {
      console.log("Fetching users from RPC API");
      const usersFromRpc = await getUsersList(null, season.contract);

      for (const user of usersFromRpc) {
        if (walletsOfUsersInDb.includes(user)) {
          const rpcUserInDb = usersInDb.find((u) => u.walletAddress === user);
          const seasonsOfUser = rpcUserInDb.seasons.map((s) => s.seasonId);
          if (seasonsOfUser.includes(season._id)) {
            console.log(
              `User already registered in season ${season._id}. User: ${user}`,
            );
            continue;
          } else {
            console.log("Fetching registration block for user: ", user);
            const registrationBlock = await getUserRegistrationBlock(
              user,
              null,
              season.contract,
            );
            if (isValidHex(registrationBlock)) {
              const newSeason = {
                seasonId: season._id,
                registrationBlock: parseInt(registrationBlock, 16),
              };

              console.log(`Adding season ${season._id} to user ${user} in DB`);
              await addSeasonToUser(user, newSeason, db.connection);
            }
          }
        } else {
          // User is not in DB.
          console.log("Fetching registration block for user: ", user);
          const registrationBlock = await getUserRegistrationBlock(
            user,
            null,
            season.contract,
          );
          if (isValidHex(registrationBlock)) {
            const newUser = {
              walletAddress: user,
              updatedAtBlock: parseInt(registrationBlock, 16),
              seasons: [
                {
                  seasonId: season._id,
                  registrationBlock: parseInt(registrationBlock, 16),
                },
              ],
            };

            console.log(`Creating user ${user} in DB`);
            await createUser(newUser, db.connection);
          }
        }
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
