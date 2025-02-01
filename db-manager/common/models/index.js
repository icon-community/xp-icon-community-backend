const userSchema = require("./users");
const taskSchema = require("./tasks");
const seasonSchema = require("./seasons");
const userTasksSchema = require("./userTasks");
const referralSchema = require("./referrals");
const dailyCheckInSchema = require("./dailyCheckIn");

module.exports = {
  userSchema,
  taskSchema,
  seasonSchema,
  userTasksSchema,
  referralSchema,
  dailyCheckInSchema,
};
