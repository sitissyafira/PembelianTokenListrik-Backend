const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RevenueSchema = new Schema(
  {
    revenueName: {
      type: String,
      required: [true, "Rate Name is required"],
    },
    serviceFee: {
      type: Number,
      required: [true, "Rate is required"],
    },
    administration: {
      type: Number,
      required: [true, "Periode is required"],
    },
    remarks: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Created By is Required"],
    },
    createdDate: {
      type: Date,
      default: Date.now(),
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    updatedDate: Date
  },
  { collection: "revneRental" }
);

const RevenueRental = mongoose.model("revenueRental", RevenueSchema);
module.exports = {RevenueRental, RevenueSchema};
