const mongoose = require("mongoose");

const BankSchema = new mongoose.Schema(
  {
    codeBank: {
      type: String,
      required: [true, "Bank Code is required"],
    },
    bank: {
      type: String,
      required: [true, "Bank Name is required"],
    },
    remarks: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Created By is Required"],
    },
    createdDate: {
      type: Date,
      default: Date.now(),
    },
    updateBy: String,
    updateDate: Date,
  },
  { collection: "bank" }
);

const Bank = mongoose.model("Bank", BankSchema);
module.exports = { Bank, BankSchema };
