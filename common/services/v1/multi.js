//
const { getUserByAddress } = require("./userService");
const { getActiveSeason, getAllSeasons } = require("./seasonService");
const { getUserTaskByAllIds } = require("./userTaskService");
const { getTaskById } = require("./taskService");
const {
  getFormattedUser,
  getFormattedTask,
  getFormattedSeason,
  getFormattedUserTask,
} = require("./utils");

async function getUserAllSeasons(userWallet, connection) {
  const user = await getUserByAddress(userWallet, connection);
  const userFormatted = getFormattedUser(user);
  const seasons = await getAllSeasons(connection);
  const seasonsFormatted = seasons.map((season) => getFormattedSeason(season));

  for (let i = 0; i < seasonsFormatted.length; i++) {
    // for (const season of seasonsFormatted) {
    const tasks = [];
    for (let ii = 0; ii < seasonsFormatted[i].tasks.length; ii++) {
      // for (const task of seasonsFormatted[i].tasks) {
      const taskFromDb = await getTaskById(
        seasons[i].tasks[ii]._id,
        connection,
      );
      const formattedTask = getFormattedTask(taskFromDb);
      const userTask = await getUserTaskByAllIds(
        user[0]._id,
        seasons[i].tasks[ii]._id,
        seasons[i]._id,
        connection,
      );
      const formattedUserTask = getFormattedUserTask(userTask);
      const taskTotalXp = formattedUserTask.xpEarned.reduce((a, b) => a + b, 0);
      tasks.push({
        task: {
          ...formattedTask,
          XPEarned_total_task: taskTotalXp,
        },
        xp: formattedUserTask,
      });
    }
    seasonsFormatted[i].tasks = tasks;
  }
  const response = {
    user: userFormatted,
    seasons: seasonsFormatted,
  };
  return response;
}

async function getUserBySeason(userWallet, userSeason, connection) {
  const user = await getUserByAddress(userWallet, connection);
  const userFormatted = getFormattedUser(user);
  const season = await getActiveSeason(connection);
  const seasonFormatted = getFormattedSeason(season[0]);
  const tasks = [];

  for (let i = 0; i < seasonFormatted.tasks.length; i++) {
    //
    // for (const task of seasonFormatted.tasks) {
    const taskFromDb = await getTaskById(season[0].tasks[i]._id, connection);
    const formattedTask = getFormattedTask(taskFromDb);
    const userTask = await getUserTaskByAllIds(
      user[0]._id,
      season[0].tasks[i]._id,
      season[0]._id,
      connection,
    );
    const formattedUserTask = getFormattedUserTask(userTask);
    const taskTotalXp = formattedUserTask.xpEarned.reduce(
      (a, b) => a + Number(b.xp),
      0,
    );
    tasks.push({
      task: {
        ...formattedTask,
        XPEarned_total_task: taskTotalXp,
      },
      xp: getFormattedUserTask(userTask),
    });
  }
  const response = {
    user: userFormatted,
    season: { ...seasonFormatted, tasks: tasks },
  };
  return response;
}

module.exports = {
  getUserAllSeasons,
  getUserBySeason,
};
