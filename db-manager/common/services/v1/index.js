const userService = require("./userService");
const taskService = require("./taskService");
const seasonService = require("./seasonService");
const userTaskService = require("./userTaskService");
const referralService = require("./referralService");
const dailyCheckInService = require("./dailyCheckInService");
const multi = require("./multi");

module.exports = {
  userService,
  taskService,
  seasonService,
  userTaskService,
  dailyCheckInService,
  multi,
  referralService,
};
