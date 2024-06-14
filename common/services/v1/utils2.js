const { getUsersBySeason } = require("./userService");
const { getSeasonByNumberId } = require("./seasonService");
const { getUserTaskByAllIds } = require("./userTaskService");
const { getFormattedUserTask } = require("./utils");

async function getRankingOfSeason(seasonNumber, connection) {
  const seasonArr = await getSeasonByNumberId(seasonNumber, connection);
  const season = seasonArr[0];
  const allUsers = await getUsersBySeason(season, connection);
  const ranked = [];

  for (let i = 0; i < allUsers.length; i++) {
    const tempData = {
      _id: allUsers[i]._id,
      address: allUsers[i].walletAddress,
      total: 0,
      tasks: [],
    };
    for (let ii = 0; ii < season.tasks.length; ii++) {
      const userTask = await getUserTaskByAllIds(
        allUsers[i]._id,
        season.tasks[ii]._id,
        season._id,
        connection,
      );
      const formattedUserTask = getFormattedUserTask(userTask);
      if (formattedUserTask == null) {
        continue;
      }
      const taskTotalXp = formattedUserTask.xpEarned.reduce(
        (a, b) => a + Number(b.xp),
        0,
      );
      tempData.total = tempData.total + taskTotalXp;
      tempData.tasks.push({
        task: season.tasks[ii]._id,
        xp: taskTotalXp,
      });
    }
    ranked.push(tempData);
  }
  ranked.sort((a, b) => b.total - a.total);
  return ranked;
}

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
        if (formattedUserTask == null) {
          continue;
        }

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

async function getTaskTotalXp(userId, taskId, seasonId, connection) {
  const userTask = await getUserTaskByAllIds(
    userId,
    taskId,
    seasonId,
    connection,
  );
  const formattedUserTask = getFormattedUserTask(userTask);

  if (formattedUserTask == null) {
    return 0;
  }
  const taskTotalXp = formattedUserTask.xpEarned.reduce(
    (a, b) => a + Number(b.xp),
    0,
  );
  return taskTotalXp;
}

function sumXpTotal(arrayOfTasks) {
  if (arrayOfTasks.length === 0) {
    return 0;
  }
  return arrayOfTasks.reduce((a, b) => a + b.task.XPEarned_total_task, 0);
}

function sumXp24hrs(arrayOfTasks) {
  if (arrayOfTasks.length === 0) {
    return 0;
  }
  return arrayOfTasks.reduce(
    (a, b) => a + b.xp.xpEarned[b.xp.xpEarned.length - 1].xp,
    0,
  );
}

module.exports = {
  getRankingOfSeason,
  getRankings,
  getTaskTotalXp,
  sumXpTotal,
  sumXp24hrs,
};
