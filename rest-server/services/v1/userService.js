const db = require("../../db/db");

async function getUserAllSeasons(user) {
  return db.a.user.wallet === user ? db.a : null;
}

async function getUserBySeason(user, season) {
  return db.b.user.wallet === user ? db.b : null;
}

module.exports = {
  getUserAllSeasons,
  getUserBySeason
};
