const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AcctSchema = new mongoose.Schema(
  {
    acctNo: {
      type: String,
      required: [false, "Main Account No is required"],
    },
    acctName: {
      type: String,
      required: [false, "Main Account Name is required"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [false, "Created By is Required"],
    },
    depth: {
      type: Number,
      required: [true, "depth is required"],
      default: 0,
    },
    isChild: {
      type: Boolean,
      required: [true, "isChild is required"],
      default: true,
    },
    createdDate: {
      type: Date,
      default: Date.now(),
    },
    AccId: {
      type: Schema.Types.ObjectId,
      ref: "Acct",
      required: [false, "AccType is required"],
    },
    AccType: {
      type: Schema.Types.ObjectId,
      ref: "Acctype",
      required: [false, "AccType is required"],
    },
    AccTypeStr: {
      type: String,
      required: [false, "AccTypeStr is required"],
    },
    balance: {
      type: Number,
      required: false,
    },
    AccCat: [{
      type: Schema.Types.ObjectId,
      required: [false],
    }],
    openingBalance: {
      type: Number,
      default: 0,
    },
    parent: {
      type: Schema.Types.ObjectId,
      required: [false],
    },
    updateBy: String,
    updateDate: Date,
    end_balance: {
      type: Array,
      required: [false, "Ending Balance is required"],
    },
  },
  { collection: "acct" }
);

const Acct = mongoose.model("Acct", AcctSchema);
module.exports = { Acct, AcctSchema };
