const assert = require("assert");
const MockDb = require("../../common/utils/mockDb");
const {
  mockSeasons,
  mockUsers,
  mockTasks,
  mockUserTasks,
} = require("../mockData/mockData");
const {
  seasonService,
  userService,
  taskService,
  userTaskService,
} = require("../../common/services/v1");
const { createSeason, getAllSeasons } = seasonService;
const { createUser, getAllUsers } = userService;
const { createTask } = taskService;
const { createUserTask } = userTaskService;

const { getRankingOfSeason } = require("../../common/services/v1/utils2");

describe("Integration tests for users and collections in mongodb", () => {
  const db = new MockDb();
  before(async () => {
    await db.createConnection();
  });

  after(async () => {
    await db.stop();
  });

  it("should create a season", async () => {
    const season = await createSeason(mockSeasons[0], db.connection);
    assert.equal(season.blockStart, mockSeasons[0].blockStart);
  });

  it("should get all seasons added in the collection", async () => {
    const response = await getAllSeasons(db.connection);
    assert.equal(response.length, 1);
  });

  it("Should insert a user into the Users colection", async () => {
    const user = mockUsers[0];
    const response = await createUser(user, db.connection);
    assert.equal(response.walletAddress, user.walletAddress);
  });

  it("Should insert a new user into the Users colection", async () => {
    const user = mockUsers[1];
    const response = await createUser(user, db.connection);
    assert.equal(response.walletAddress, user.walletAddress);
  });

  it("Should get all users added in the collection", async () => {
    const response = await getAllUsers(db.connection);
    assert.equal(response.length, 2);
  });

  it("Should insert a task into the Task colection", async () => {
    const task = mockTasks[0];
    const response = await createTask(task, db.connection);
    assert.equal(response.seedId, task.seedId);
  });

  it("Should insert a userTask into the UserTask colection", async () => {
    const userTask = mockUserTasks[0];
    const response = await createUserTask(userTask, db.connection);
    assert.equal(response.status, userTask.status);
  });

  it("Should insert a new userTask into the UserTask colection", async () => {
    const userTask = mockUserTasks[1];
    const response = await createUserTask(userTask, db.connection);
    assert.equal(response.status, userTask.status);
  });

  it("should get user ranking of a season", async () => {
    const response = await getRankingOfSeason(1, db.connection);
    assert.equal(response[0].total, 110);
  });
});
