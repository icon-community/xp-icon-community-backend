const assert = require("assert");
const MockDb = require("../../utils/mockDb");
const mockTasks = require("../mockData/tasks");
const {
  createTask,
  getAllTasks,
} = require("../../rest-server/services/v1/taskService");

describe("Task Collection", () => {
  const db = new MockDb();
  before(async () => {
    await db.createConnection();
  });

  after(async () => {
    await db.stop();
  });

  it("should create a task", async () => {
    const task = await createTask(mockTasks[0], db.connection);
    assert.equal(task.title, mockTasks[0].title);
  });

  it("should get all tasks added in the collection", async () => {
    const response = await getAllTasks(db.connection);
    assert.equal(response.length, 1);
  });
});
