const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EngineerSchema = new Schema(
  {
    engnrid: {
      type: String,
      required: [true, "ID is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    isToken: {
      type: Boolean,
      default: false,
    },
    department: {
      type: mongoose.Schema.ObjectId,
      ref: "department",
    },
    division: {
      type: mongoose.Schema.ObjectId,
      ref: "division",
    },
    shift: {
      type: mongoose.Schema.ObjectId,
      ref: "ShiftSchedule",
    },
    attachment: {
      type: String,
      required: [false, "attachment is required"],
    },
    birth_date: {
      type: Date,
      required: [false, "birth date is required"],
    },
    join_date: {
      type: Date,
      required: [false, "join date is required"],
    },
  },
  { collection: "engineer" }
);

const Engineer = mongoose.model("Engineer", EngineerSchema);
module.exports = { Engineer, EngineerSchema };
