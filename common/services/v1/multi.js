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
const {
  getRankingOfSeason,
  getTaskTotalXp,
  sumXpTotal,
  sumXp24hrs,
} = require("./utils2");
const { getIcxBalance } = require("../../../utils/json-rpc-services");
const { isValidHex } = require("../../../utils/utils");
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

async function getUserBySeason(userWallet, seasonLabel, connection) {
  const seasonDbLabel = config.seasonsRoutes[seasonLabel];

  if (seasonDbLabel == null) {
    throw new Error("Invalid season");
  }

  const allUsers = await getAllUsers(connection);
  const user = allUsers.filter((user) => user.walletAddress === userWallet);
  const userFormatted = getFormattedUser(user);
  if (userFormatted == null) {
    throw new Error("User not found");
  }

  const season = await getSeasonByNumberId(seasonDbLabel, connection);
  const seasonFormatted = getFormattedSeason(season[0]);
  if (seasonFormatted == null) {
    throw new Error("Season not found");
  }

  const tasks = [];
  const userAboveTasks = [];
  const userBelowTasks = [];

  const rankings = await getRankingOfSeason(seasonDbLabel, connection);
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
    if (formattedTask == null) {
      console.log("Task not found");
      continue;
    }

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
    if (formattedUserTask == null) {
      console.log("User task not found");
      continue;
    }
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
      XPEarned_24hrs: sumXp24hrs(tasks),
      tasks: tasks,
    },
  };
  return response;
}

async function getCustomSeasonData(seasonLabel, connection) {
  const seasonDbLabel = config.seasonsRoutes[seasonLabel];

  if (seasonDbLabel == null) {
    throw new Error("Invalid season");
  }

  const season = await getSeasonByNumberId(seasonDbLabel, connection);
  const seasonFormatted = getFormattedSeason(season[0]);
  if (seasonFormatted == null) {
    throw new Error("Season not found");
  }

  const users = await getUsersBySeason(season[0]._id, connection);
  const userCount = users.length;

  let icxBalance = 0;

  const tasks = [];
  for (const task of season[0].tasks) {
    const taskFromDb = await getTaskById(task._id, connection);
    const taskObj = {
      description: taskFromDb[0].description,
      title: taskFromDb[0].title,
    };

    if (taskObj.title === "registration") {
      continue;
    }

    let ammount = 0;
    const formula = new Function(...taskFromDb[0].rewardFormula);
    const divider = formula(1);
    for (let i = 0; i < userCount; i++) {
      // this will only run once, for the first task
      // that way we dont duplicate the icx balance
      const user = users[i];
      if (tasks.length == 0) {
        const icxBalanceUserAsHex = await getIcxBalance(user.walletAddress);

        if (!isValidHex(icxBalanceUserAsHex)) {
          // if the response is not a valid hex, skip this user
          continue;
        }
        icxBalance += parseInt(icxBalanceUserAsHex, 16) / 10 ** 18;
      }

      const userTask = await getUserTaskByAllIds(
        user._id,
        task._id,
        season[0]._id,
        connection,
      );

      const lastXp =
        userTask[0].xpEarned[userTask[0].xpEarned.length - 1].xp / divider;

      if (!Number.isNaN(lastXp)) {
        ammount += lastXp;
      }
    }

    taskObj.totalLastDay = ammount;

    tasks.push(taskObj);
  }

  const response = {
    season: {
      number: seasonFormatted.number,
      blockStart: seasonFormatted.blockStart,
      blockEnd: seasonFormatted.blockEnd,
      userCount: userCount,
      balance_in_wallets: {
        icx: icxBalance,
      },
      task: tasks,
    },
  };
  return response;
}

module.exports = {
  getUserAllSeasons,
  getUserBySeason,
  getCustomSeasonData,
};
