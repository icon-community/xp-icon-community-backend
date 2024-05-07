//
const { getUserByAddress } = require("./userService");
const { getActiveSeason, getAllSeasons } = require("./seasonService");
const { getTasksByUserAndSeason } = require("./taskService");

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
  const tasks = await getTasksByUserAndSeason(user._id, season._id, connection);
  console.log("season");
  console.log(season);
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
