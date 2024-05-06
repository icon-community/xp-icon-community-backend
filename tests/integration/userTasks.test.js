const assert = require("assert");
const MockDb = require("../../utils/mockDb");
const mockUserTasks = require("../mockData/userTasks");
const {
  createUserTask,
  getAllUserTasks,
} = require("../../common/services/v1/userTaskService");

describe("User Task Collection", () => {
  const db = new MockDb();
  before(async () => {
    await db.createConnection();
  });

  after(async () => {
    await db.stop();
  });

  it("should create a user task", async () => {
    const userTask = await createUserTask(mockUserTasks[0], db.connection);
    assert.equal(userTask.xpEarned, mockUserTasks[0].xpEarned);
  });

  it("should get all user task added in the collection", async () => {
    const response = await getAllUserTasks(db.connection);
    assert.equal(response.length, 1);
  });
});
