//
const mongoose = require("mongoose");
const seasons = [
  {
    number: 1,
    blockStart: "0x64",
    blockEnd: "0xc8",
    active: false,
    contract: "cx01",
    tasks: [new mongoose.Types.ObjectId()],
  },
  {
    number: 2,
    blockStart: "0x12c",
    blockEnd: "0x190",
    active: true,
    contract: "cx02",
    tasks: [new mongoose.Types.ObjectId()],
  },
];

module.exports = seasons;
