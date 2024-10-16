//

// Imports
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const config = require("../utils/config");

// validating that the environment variable has
// an entry for the tasks collections
if (config.collections.task == null) {
  console.log("tasks collection is not defined in the environment file");
  throw new Error("CRITICAL");
}
/*
 * Season Schema
 */
const seasonSchema = new Schema({
  number: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  blockStart: {
    type: Number,
    required: true,
  },
  blockEnd: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return v > this.blockStart;
      },
      message: "blockEnd must be greater than blockStart",
    },
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  contract: {
    type: String,
    required: true,
  },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: config.collections.task,
      required: true,
    },
  ],
});

//NOTE: the following code block restricts the number
//of active seasons to 1

// seasonSchema.pre("save", async function (next) {
//   if (this.isModified("active") && this.active === true) {
//     const existingDoc = await this.constructor.findOne({ active: true });
//     if (existingDoc) {
//       throw new Error("Only one season can be active at a time");
//     }
//   }

//   next();
// });

// const Season = mongoose.model("Season", seasonSchema);
module.exports = seasonSchema;
