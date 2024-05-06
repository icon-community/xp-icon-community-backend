//
const config = require("../../../utils/config");
const USER_TASK = config.collections.userTask;
const {
  createEntry,
  getAllEntries,
  getEntryByParam,
  updateOrCreateEntry,
} = require("./common");

async function createUserTask(userTask, connection) {
  return createEntry(userTask, USER_TASK, connection);
}

async function getAllUserTasks(connection) {
  return await getAllEntries(USER_TASK, connection);
}

async function getUserTaskByAllIds(userId, taskId, seasonId, connection) {
  return await getEntryByParam(
    {
      userId,
      taskId,
      seasonId,
    },
    USER_TASK,
    connection,
  );
}

async function updateOrCreateUserTask(query, update, connection) {
  return await updateOrCreateEntry(query, update, USER_TASK, connection);
}

module.exports = {
  createUserTask,
  getAllUserTasks,
  getUserTaskByAllIds,
  updateOrCreateUserTask,
};
