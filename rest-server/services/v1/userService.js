//
const config = require("../../utils/config");
const USER = config.collections.users;
const isTestEnv = process.env.USE_MOCK_DB != null ? true : false;
const { createEntry, getAllEntries } = require("./common");
const mockData = require("../../utils/mockData");

async function createUser(user, connection) {
  return await createEntry(user, USER, connection);
}

async function getAllUsers(connection) {
  return await getAllEntries(USER, connection);
}

async function getUserAllSeasons(userWallet) {
  // TODO: the following logic is pulling static data from
  // a mock file. the entire section inside the if block
  // should be replaced with a call to the database once
  // the database is set up and implemented.
  // In the meantime the new logic should be implemented
  // in the else block.
  // In the end the if block should be removed and only
  // the information that was in the else block should
  // remain, also delete this comment once the changes
  // are made.
  if (isTestEnv) {
    const filteredUser = mockData.users.filter(
      (user) => user.address === userWallet,
    );
    if (filteredUser.length > 0) {
      return {
        ...filteredUser[0],
      };
    } else {
      return null;
    }
  } else {
    // TODO: new logic should be implemented here
    return null;
  }
}

async function getUserBySeason(userWallet, userSeason) {
  // TODO: the following logic is pulling static data from
  // a mock file. the entire section inside the if block
  // should be replaced with a call to the database once
  // the database is set up and implemented.
  // In the meantime the new logic should be implemented
  // in the else block.
  // In the end the if block should be removed and only
  // the information that was in the else block should
  // remain, also delete this comment once the changes
  // are made.
  console.log("getUserBySeason");
  console.log(userWallet);
  console.log(userSeason);
  if (isTestEnv) {
    const filteredUser = mockData.users.filter(
      (user) => user.address === userWallet,
    );
    const filteredSeason = mockData.seasons.filter(
      (season) => season.number == userSeason,
    );
    console.log(JSON.stringify(filteredUser));
    console.log(filteredSeason);
    if (filteredUser.length > 0 && filteredSeason.length > 0) {
      return {
        ...filteredUser[0],
        seasons: filteredUser[0].seasons.filter(
          (season) => season.seasonId.equals(filteredSeason[0]._id) == true,
        ),
      };
    } else {
      return null;
    }
  } else {
    // TODO: new logic should be implemented here
    return null;
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserAllSeasons,
  getUserBySeason,
};
