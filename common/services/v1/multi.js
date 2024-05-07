//
const { getUserByAddress } = require("./userService");
const { getActiveSeason, getAllSeasons } = require("./seasonService");

async function getUserAllSeasons(userWallet, connection) {
  const user = await getUserByAddress(userWallet, connection);
  const season = await getAllSeasons(connection);
  const response = {
    user: user,
    seasons: season,
  };
  return response;
}

async function getUserBySeason(userWallet, userSeason, connection) {
  const user = await getUserByAddress(userWallet, connection);
  const season = await getActiveSeason(connection);
  const response = {
    user: user,
    season: season,
  };
  return response;
}

module.exports = {
  getUserAllSeasons,
  getUserBySeason,
};
