//
require("dotenv").config();
const USER = process.env.USER_COLLECTION;
const { createEntry, getAllEntries } = require("./common");

async function createUser(user, connection) {
  return await createEntry(user, USER, connection);
}

async function getAllUsers(connection) {
  return await getAllEntries(USER, connection);
}

module.exports = {
  createUser,
  getAllUsers,
};
