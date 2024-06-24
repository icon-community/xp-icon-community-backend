//
const config = require("../../../utils/config");
const USER = config.collections.users;
const {
  createEntry,
  getAllEntries,
  getEntryByParam,
  updateOrCreateEntry,
  getDocumentCount,
} = require("./common");

async function createUser(user, connection) {
  return await createEntry(user, USER, connection);
}

async function getAllUsers(connection) {
  return await getAllEntries(USER, connection);
}

async function getUserByAddress(userWallet, connection) {
  return await getEntryByParam({ walletAddress: userWallet }, USER, connection);
}

async function addSeasonToUser(userWallet, season, connection) {
  return await updateOrCreateEntry(
    { walletAddress: userWallet },
    { $push: { seasons: season } },
    USER,
    connection,
    false,
  );
}

async function getUsersBySeason(season, connection) {
  return await getEntryByParam(
    { "seasons.seasonId": season },
    USER,
    connection,
  );
}

async function getUserCountBySeason(season, connection) {
  return await getDocumentCount(
    { "seasons.seasonId": season },
    USER,
    connection,
  );
}

module.exports = {
  createUser,
  getAllUsers,
  getUserByAddress,
  addSeasonToUser,
  getUsersBySeason,
  getUserCountBySeason,
};
