const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AcctBankSchema = new Schema(
  {
    bank: {
      type: Schema.Types.ObjectId,
      ref: "Bank",
      required: [true, "Bank is required"],
    },
    acctName: {
      type: String,
      required: [true, "Account Name is required"],
    },
    acctNum: {
      type: Number,
      required: [true, "Account Number is required"],
    },
    branch: {
      type: String,
      required: [true, "Branch is required"],
    },
    remarks: {
      type: String,
    },
    idParent: {
      type: Schema.Types.ObjectId,
      ref: "Acctbank",
      require: [true, "Account Parent Type is required"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
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
  { collection: "acctbank" }
);

const Acctbank = mongoose.model("Acctbank", AcctBankSchema);
module.exports = { Acctbank, AcctBankSchema };
