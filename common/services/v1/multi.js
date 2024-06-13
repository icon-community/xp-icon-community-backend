//
const { getAllUsers, getUsersBySeason } = require("./userService");
const { getAllSeasons, getSeasonByNumberId } = require("./seasonService");
const { getUserTaskByAllIds } = require("./userTaskService");
const { getTaskById } = require("./taskService");
const {
  getFormattedUser,
  getFormattedTask,
  getFormattedSeason,
  getFormattedUserTask,
} = require("./utils");
const { getRankingOfSeason, getTaskTotalXp, sumXpTotal } = require("./utils2");
const config = require("../../../utils/config");

//TODO: This function havent been updated to work with
//the latest changes that have been made to the code
async function getUserAllSeasons(userWallet, connection) {
  const allUsers = await getAllUsers(connection);
  const user = allUsers.filter((user) => user.walletAddress === userWallet);
  const userFormatted = getFormattedUser(user);
  const seasons = await getAllSeasons(connection);
  const seasonsFormatted = seasons.map((season) => getFormattedSeason(season));

  // const rankings = await getRankings(allUsers, seasons, connection);
  // console.log("rankings");
  // console.log(JSON.stringify(rankings));
  // console.log(rankings);
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
      const taskTotalXp = formattedUserTask.xpEarned.reduce(
        (a, b) => a + Number(b.xp),
        0,
      );
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
  const seasonDbNumber = config.seasonsRoutes[userSeason];

  if (seasonDbNumber == null) {
    throw new Error("Invalid season");
  }

  const allUsers = await getAllUsers(connection);
  const user = allUsers.filter((user) => user.walletAddress === userWallet);
  const userFormatted = getFormattedUser(user);

  const season = await getSeasonByNumberId(seasonDbNumber, connection);
  const seasonFormatted = getFormattedSeason(season[0]);
  const tasks = [];
  const userAboveTasks = [];
  const userBelowTasks = [];

  const rankings = await getRankingOfSeason(seasonDbNumber, connection);
  const thisUserIndex = rankings.findIndex((userIndex) =>
    userIndex._id.equals(user[0]._id),
  );
  const userAbove =
    thisUserIndex - 1 < 0 ? null : rankings[thisUserIndex - 1].address;
  const userBelow =
    thisUserIndex + 1 >= rankings.length
      ? null
      : rankings[thisUserIndex + 1].address;

  for (let i = 0; i < seasonFormatted.tasks.length; i++) {
    //
    const taskFromDb = await getTaskById(season[0].tasks[i]._id, connection);
    const formattedTask = getFormattedTask(taskFromDb);

    if (userAbove != null) {
      const totalXp = await getTaskTotalXp(
        rankings[thisUserIndex - 1]._id,
        season[0].tasks[i]._id,
        season[0]._id,
        connection,
      );
      userAboveTasks.push({
        task: {
          XPEarned_total_task: totalXp,
        },
      });
    }

    if (userBelow != null) {
      const totalXp = await getTaskTotalXp(
        rankings[thisUserIndex + 1]._id,
        season[0].tasks[i]._id,
        season[0]._id,
        connection,
      );
      userBelowTasks.push({
        task: {
          XPEarned_total_task: totalXp,
        },
      });
    }

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
      xp: formattedUserTask,
    });
  }

  const response = {
    user: userFormatted,
    season: {
      ...seasonFormatted,
      Rank: thisUserIndex + 1,
      Address_above: userAbove,
      Address_below: userBelow,
      Address_above_XP: sumXpTotal(userAboveTasks),
      Address_below_XP: sumXpTotal(userBelowTasks),
      XPEarned_total: sumXpTotal(tasks),
      XPEarned_24hrs: tasks.reduce(
        (a, b) => a + b.xp.xpEarned[b.xp.xpEarned.length - 1].xp,
        0,
      ),
      tasks: tasks,
    },
  };
  return response;
}

module.exports = {
  getUserAllSeasons,
  getUserBySeason,
};
