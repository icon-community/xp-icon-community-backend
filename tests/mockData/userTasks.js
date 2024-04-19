//
const mongoose = require("mongoose");

const userTasks = [
  {
    userId: new mongoose.Types.ObjectId(),
    taskId: new mongoose.Types.ObjectId(),
    seasonId: new mongoose.Types.ObjectId(),
    status: "pending",
    xpEarned: 11,
    createdAt: new Date(),
  },
];

module.exports = userTasks;
