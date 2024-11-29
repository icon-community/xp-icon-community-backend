//
require("dotenv").config();
const mongoose = require("mongoose");
const {
  userSchema,
  taskSchema,
  seasonSchema,
  userTasksSchema,
  referralSchema,
} = require("../models");
const config = require("./config");

class MainDb {
  constructor({ uri: uri } = {}) {
    this.connection = null;
    this.uri = uri == null ? config.mongoParams.uri : uri;
  }

  async createConnection() {
    try {
      // connect to database
      console.log(`Connecting to main database at ${this.uri}`);
      this.connection = await mongoose.createConnection(this.uri).asPromise();

      // setup models
      console.log("Connection to main database created.");
      this.connection.model(config.collections.users, userSchema);
      this.connection.model(config.collections.task, taskSchema);
      this.connection.model(config.collections.season, seasonSchema);
      this.connection.model(config.collections.userTask, userTasksSchema);
      this.connection.model(config.collections.referrals, referralSchema);
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
