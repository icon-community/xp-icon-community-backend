//
require("dotenv").config();
const USER = process.env.USER_COLLECTION;

async function createUser(user, connection) {
  const model = connection.model(USER);
  const newUser = new model(user);
  return await newUser.save();
}

async function getAllUsers(connection) {
  const model = connection.model(USER);
  return await model.find();
}

module.exports = {
  createUser,
  getAllUsers,
};
