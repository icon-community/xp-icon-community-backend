//
const config = require("../../utils/config");
const SEASON = config.collections.season;
const {
  createEntry,
  getAllEntries,
  getEntryByParam,
  updateOrCreateEntry,
} = require("./common");

async function createSeason(season, connection) {
  return await createEntry(season, SEASON, connection);
}

async function updateSeason(query, season, connection) {
  return await updateOrCreateEntry(query, season, SEASON, connection);
}

async function getAllSeasons(connection) {
  return await getAllEntries(SEASON, connection);
}

async function getActiveSeason(connection) {
  return await getEntryByParam({ active: true }, SEASON, connection);
}

async function getSeasonByNumberId(numberId, connection) {
  return await getEntryByParam({ number: numberId }, SEASON, connection);
}

module.exports = {
  createSeason,
  getAllSeasons,
  getActiveSeason,
  getSeasonByNumberId,
  updateSeason,
};
