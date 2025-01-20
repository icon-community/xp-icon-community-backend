//
const config = require("../../utils/config");
const REFERRALS = config.collections.referrals;
const {
  createEntry,
  getAllEntries,
  getEntryByParam,
  updateOrCreateEntry,
} = require("./common");

async function createReferral(referral, connection) {
  return createEntry(referral, REFERRALS, connection);
}

async function getAllReferrals(connection) {
  return await getAllEntries(REFERRALS, connection);
}

async function updateOrCreateReferral(query, update, connection) {
  return await updateOrCreateEntry(query, update, REFERRALS, connection);
}

async function getReferralByReferrerIdAndSeason(reffererUserId, seasonLabel, connection) {
  return await getEntryByParam(
    {
      referrerUserId: reffererUserId,
      seasonLabel: seasonLabel,
    },
    REFERRALS,
    connection,
  );
}

async function getReferralByReferredIdAndSeason(refferedUserId, seasonLabel, connection) {
  return await getEntryByParam(
    {
      referredUserId: refferedUserId,
      seasonLabel: seasonLabel,
    },
    REFERRALS,
    connection,
  );
}

module.exports = {
  createReferral,
  getAllReferrals,
  updateOrCreateReferral,
  getReferralByReferrerIdAndSeason,
  getReferralByReferredIdAndSeason,
};
