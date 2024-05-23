//
const { getUserByAddress, getAllUsers } = require("./userService");
const { getActiveSeason, getAllSeasons } = require("./seasonService");
const { getUserTaskByAllIds } = require("./userTaskService");
const { getTaskById } = require("./taskService");
const {
  getFormattedUser,
  getFormattedTask,
  getFormattedSeason,
  getFormattedUserTask,
} = require("./utils");

async function getRankings(allUsers, seasons, connection) {
  const rankData = {};
  for (let i = 0; i < seasons.length; i++) {
    rankData[seasons[i]._id] = [];
    for (let ii = 0; ii < allUsers.length; ii++) {
      const tempData = {
        _id: allUsers[ii]._id,
        address: allUsers[ii].walletAddress,
        total: 0,
        tasks: [],
      };
      for (let iii = 0; iii < seasons[i].tasks.length; iii++) {
        const userTask = await getUserTaskByAllIds(
          allUsers[ii]._id,
          seasons[i].tasks[iii]._id,
          seasons[i]._id,
          connection,
        );
        const formattedUserTask = getFormattedUserTask(userTask);
        const taskTotalXp = formattedUserTask.xpEarned.reduce(
          (a, b) => a + Number(b.xp),
          0,
        );
        tempData.total = tempData.total + taskTotalXp;
        tempData.tasks.push({
          task: seasons[i].tasks[iii]._id,
          xp: taskTotalXp,
        });
      }
      rankData[seasons[i]._id].push(tempData);
    }
  }

  for (const key in rankData) {
    rankData[key].sort((a, b) => b.total - a.total);
  }

  return rankData;
}

async function getUserAllSeasons(userWallet, connection) {
  const allUsers = await getAllUsers(connection);
  const user = allUsers.filter((user) => user.walletAddress === userWallet);
  const userFormatted = getFormattedUser(user);
  const seasons = await getAllSeasons(connection);
  const seasonsFormatted = seasons.map((season) => getFormattedSeason(season));

  const rankings = await getRankings(allUsers, seasons, connection);
  console.log("rankings");
  console.log(JSON.stringify(rankings));
  console.log(rankings);
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
  const allUsers = await getAllUsers(connection);
  const user = allUsers.filter((user) => user.walletAddress === userWallet);
  const userFormatted = getFormattedUser(user);
  const season = await getActiveSeason(connection);
  const seasonFormatted = getFormattedSeason(season[0]);
  const tasks = [];

  const rankings = await getRankings(allUsers, season, connection);
  const thisUserIndex = rankings[season[0]._id].findIndex(
    (userIndex) => userIndex._id === user[0]._id,
  );
  const userAbove =
    thisUserIndex - 1 < 0
      ? null
      : rankings[season[0]._id][thisUserIndex - 1].address;
  const userBelow =
    thisUserIndex + 1 >= rankings[season[0]._id].length
      ? null
      : rankings[season[0]._id][thisUserIndex + 1].address;

  console.log("rankings");
  console.log(thisUserIndex);
  for (let i = 0; i < seasonFormatted.tasks.length; i++) {
    //
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
    season: {
      ...seasonFormatted,
      Rank: thisUserIndex + 1,
      Address_above: userAbove,
      Address_below: userBelow,
      XPEarned_total: tasks.reduce((a, b) => a + b.task.XPEarned_total_task, 0),
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
