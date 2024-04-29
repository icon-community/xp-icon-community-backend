//
const config = require("../../../utils/config");
const SEASON = config.collections.season;
const { createEntry, getAllEntries } = require("./common");

async function createSeason(season, connection) {
  return await createEntry(season, SEASON, connection);
}

async function getAllSeasons(connection) {
  return await getAllEntries(SEASON, connection);
}

module.exports = {
  createSeason,
  getAllSeasons,
};
