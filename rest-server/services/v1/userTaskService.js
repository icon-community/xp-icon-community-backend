//
require("dotenv").config();
const USER_TASK = process.env.USER_TASK_COLLECTION;
const { createEntry, getAllEntries } = require("./common");

async function createUserTask(userTask, connection) {
  return createEntry(userTask, USER_TASK, connection);
}

async function getAllUserTasks(connection) {
  return await getAllEntries(USER_TASK, connection);
}

module.exports = {
  createUserTask,
  getAllUserTasks,
};
