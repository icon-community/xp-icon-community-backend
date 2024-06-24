function getFormattedUser(user) {
  if (user.length === 0) {
    return null;
  }
  return {
    // _id: user[0]._id,
    walletAddress: user[0].walletAddress,
    registrationBlock: user[0].registrationBlock,
  };
}

//TODO: handle when 'task' is an empty array
function getFormattedUserTask(task) {
  if (task.length === 0) {
    return null;
  }
  return {
    // _id: task[0]._id,
    // taskId: task[0].taskId,
    // seasonId: task[0].seasonId,
    // userId: task[0].userId,
    status: task[0].status,
    xpEarned: task[0].xpEarned,
  };
}
function getFormattedTask(task) {
  if (task.length === 0) {
    return null;
  }
  return {
    // _id: task[0]._id,
    type: task[0].type,
    title: task[0].title,
    description: task[0].description,
    chain: task[0].chain,
    rewardFormula: task[0].rewardFormula,
  };
}

function getFormattedSeason(seasons) {
  if (seasons.length === 0) {
    return null;
  }
  const season = seasons[0];
  return {
    // _id: season[0]._id,
    number: season.number,
    blockStart: season.blockStart,
    blockEnd: season.blockEnd,
    active: season.active,
    tasks: season.tasks,
    XPEarned_total: null,
    XPEarned_24hrs: null,
    Rank: null,
    Address_above: null,
    Address_below: null,
  };
}

module.exports = {
  getFormattedUser,
  getFormattedTask,
  getFormattedSeason,
  getFormattedUserTask,
};
