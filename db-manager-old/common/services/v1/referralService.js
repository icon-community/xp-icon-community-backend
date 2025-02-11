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

async function getReferralByReferrerIdAndSeason(
  referrerUserId,
  seasonLabel,
  connection,
) {
  const result = await getEntryByParam(
    {
      referrerUserId: referrerUserId,
      seasonLabel: seasonLabel,
    },
    REFERRALS,
    connection,
  );

  return result;
}

async function getReferralByReferredIdAndSeason(
  referredUserId,
  seasonLabel,
  connection,
) {
  const result = await getEntryByParam(
    {
      referredUserId: referredUserId,
      seasonLabel: seasonLabel,
    },
    REFERRALS,
    connection,
  );
  return result;
}

module.exports = {
  createReferral,
  getAllReferrals,
  updateOrCreateReferral,
  getReferralByReferrerIdAndSeason,
  getReferralByReferredIdAndSeason,
};
