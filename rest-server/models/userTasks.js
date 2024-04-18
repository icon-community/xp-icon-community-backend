//

// Import
const mongoose = require("mongoose");
const { Schema } = mongoose;

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
  xpEarned: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// const UserTasks = mongoose.model("UserTasks", userTasksSchema);
module.exports = userTasksSchema;
