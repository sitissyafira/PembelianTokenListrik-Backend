const mongoose = require("mongoose");

const AcctypeSchema = new mongoose.Schema(
  {
    acctypeno: {
      type: String,
      required: [true, "acctypeno is required"],
    },
    acctype: {
      type: String,
      ref: "Acctype",
      required: [true, "acctype is required"],
    },
    status: {
      type: String,
      required: [false, "acctype is required"],
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [false, "Created By is Required"],
    },
  },
  { collection: "acctype" }
);

const Acctype = mongoose.model("Acctype", AcctypeSchema);
module.exports = { Acctype, AcctypeSchema };
