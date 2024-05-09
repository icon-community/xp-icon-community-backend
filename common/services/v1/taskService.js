//
const config = require("../../../utils/config");
const TASK = config.collections.task;
const { createEntry, getAllEntries, getEntryByParam } = require("./common");

async function createTask(task, connection) {
  return await createEntry(task, TASK, connection);
}

async function getAllTasks(connection) {
  return await getAllEntries(TASK, connection);
}

async function getTaskBySeedId(seedId, connection) {
  return await getEntryByParam({ seedId }, TASK, connection);
}

async function getTaskById(taskId, connection) {
  return await getEntryByParam({ _id: taskId }, TASK, connection);
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskBySeedId,
  getTaskById,
};
