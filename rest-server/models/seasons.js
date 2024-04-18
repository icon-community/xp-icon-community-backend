//

// Imports
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/*
 * Season Schema
 */
const seasonSchema = new Schema({
  number: {
    type: Number,
    required: true,
  },
  blockStart: {
    type: String,
    required: true,
  },
  blockEnd: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
});

// const Season = mongoose.model("Season", seasonSchema);
module.exports = seasonSchema;
