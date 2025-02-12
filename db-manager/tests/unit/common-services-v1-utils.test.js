const assert = require("assert");
const {
  getFormattedUser,
  getFormattedTask,
  getFormattedSeason,
  getFormattedUserTask,
} = require("../../common/services/v1/utils");

const user = [
  {
    walletAddress: "0x123",
    registrationBlock: 1,
  },
];

const userTask = [
  {
    status: "PENDING",
    xpEarned: 10,
  },
];

const task = [
  {
    type: "TASK",
    title: "Task 1",
    description: "Task 1 description",
    chain: "ETHEREUM",
    rewardFormula: "10",
  },
];

const season = [
  {
    number: 1,
    blockStart: 1,
    blockEnd: 100,
    active: true,
    tasks: [],
    XPEarned_total: null,
    XPEarned_24hrs: null,
    Rank: null,
    Address_above: null,
    Address_below: null,
  },
];

describe("Unit tests for common/services/v1/utils.js", () => {
  it("returns a user object formatted", () => {
    const formattedObject = getFormattedUser(user);
    assert.equal(formattedObject.walletAddress, user[0].walletAddress);
  });

  it("returns a userTask object formatted", () => {
    const formattedObject = getFormattedUserTask(userTask);
    assert.equal(formattedObject.status, userTask[0].status);
  });

  it("returns a task object formatted", () => {
    const formattedObject = getFormattedTask(task);
    assert.equal(formattedObject.type, task[0].type);
  });

  it("returns a season object formatted", () => {
    const formattedObject = getFormattedSeason(season);
    assert.equal(formattedObject.number, season[0].number);
  });
});
