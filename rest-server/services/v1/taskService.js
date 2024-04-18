//
require("dotenv").config();
const TASK = process.env.TASK_COLLECTION;
const { createEntry, getAllEntries } = require("./common");

async function createTask(task, connection) {
  return await createEntry(task, TASK, connection);
}

async function getAllTasks(connection) {
  return await getAllEntries(TASK, connection);
}

module.exports = {
  createTask,
  getAllTasks,
};
