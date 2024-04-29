//
require("dotenv").config();
const mongoose = require("mongoose");
const {
  userSchema,
  taskSchema,
  seasonSchema,
  userTasksSchema,
} = require("../rest-server/models");

class MainDb {
  constructor() {
    this.connection = null;
    this.uri = process.env.URI;
  }

  async createConnection() {
    try {
      // connect to database
      this.connection = await mongoose.createConnection(this.uri).asPromise();

      // setup models
      console.log("Connection to main database created.");
      this.connection.model(process.env.USER_COLLECTION, userSchema);
      this.connection.model(process.env.TASK_COLLECTION, taskSchema);
      this.connection.model(process.env.SEASON_COLLECTION, seasonSchema);
      this.connection.model(process.env.USER_TASK_COLLECTION, userTasksSchema);
    } catch (err) {
      console.log("error creating connection to main database: ");
      console.log(err);
    }
  }

  async stop() {
    try {
      if (this.connection !== null) {
        await this.connection.close();
        console.log("Connection to main database closed.");
      } else {
        throw new Error("Connection already closed.");
      }
    } catch (err) {
      console.log("error closing connection to main database: ");
      console.log(err);
    }
  }
}

module.exports = MainDb;