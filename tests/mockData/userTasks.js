//
const mongoose = require("mongoose");

const userTasks = [
  {
    userId: new mongoose.Types.ObjectId(),
    taskId: new mongoose.Types.ObjectId(),
    seasonId: new mongoose.Types.ObjectId(),
    status: "pending",
    xpEarned: [
      {
        xp: 11,
        block: 1,
        period: 1,
      },
    ],
    createdAt: new Date(),
    updatedAtBlock: 0,
  },
];

module.exports = userTasks;
