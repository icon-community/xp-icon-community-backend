//

// Import
const mongoose = require("mongoose");
const { Schema } = mongoose;

const xpEarnedSchema = new Schema({
  xp: {
    type: Number,
    required: true,
  },
  block: {
    type: Number,
    required: true,
  },
  period: {
    type: Number,
    required: true,
  },
});
/*
 *
 */
const userTasksSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  taskId: {
    type: Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  seasonId: {
    type: Schema.Types.ObjectId,
    ref: "Season",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  walletAddress: {
    type: String,
    required: true,
  },
  xpEarned: {
    type: [xpEarnedSchema],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAtBlock: {
    type: Number,
    required: true,
  },
});

// const UserTasks = mongoose.model("UserTasks", userTasksSchema);
module.exports = userTasksSchema;
