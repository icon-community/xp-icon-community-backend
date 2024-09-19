//
require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const {
  userSchema,
  taskSchema,
  seasonSchema,
  userTasksSchema,
} = require("../models");

class MockDb {
  constructor() {
    this.mongod = null;
    this.connection = null;
    this.uri = null;
  }

  async createConnection() {
    try {
      if (this.mongod !== null) {
        console.log("Error: mongodb connection already created.");
        return;
      }
      this.mongod = await MongoMemoryServer.create();
      this.uri = this.mongod.getUri();

      // connecto to database
      this.connection = await mongoose.createConnection(this.uri).asPromise();

      // setup models
      console.log("Connection to mock database created.");
      this.connection.model(process.env.USER_COLLECTION, userSchema);
      this.connection.model(process.env.TASK_COLLECTION, taskSchema);
      this.connection.model(process.env.SEASON_COLLECTION, seasonSchema);
      this.connection.model(process.env.USER_TASK_COLLECTION, userTasksSchema);
    } catch (err) {
      console.log("error creating connection to mock database: ");
      console.log(err);
    }
  }

  async stop() {
    if (this.mongod !== null) {
      await this.connection.dropDatabase();
      await this.connection.close();
      await this.mongod.stop();
      this.mongod = null;
      this.uri = null;
      console.log("Connection to mock database closed.");
    } else {
      console.log("Error: connection already closed.");
    }
  }

  async dropCollections() {
    if (this.connection !== null) {
      const collections = await this.connection.db.collections();
      for (let collection of collections) {
        await collection.remove();
      }
      console.log("Collections dropped.");
    } else {
      console.log("Error: connection not established.");
    }
  }
}

module.exports = MockDb;
