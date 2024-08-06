const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mtrTokRate = new Schema(
  {
    name: {
      type: String,
    },
    rate: {
      type: Number,
    },
    adminRate: {
      type: Number,
    },
    status: {
      type: String,
    },
  },
  { collection: "tok_mrate" }
);

const tok_mrate = mongoose.model("Tok_Mas_Rate", mtrTokRate);
module.exports = { tok_mrate, mtrTokRate };
