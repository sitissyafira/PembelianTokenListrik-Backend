const mongoose = require("mongoose");

const internalUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name Employee is Required"],
    },
    email: {
      type: String,
      required: [false, "email is Required"],
    },
    phone: {
      type: String,
      required: [false, "phone is Required"],
    },
    department: {
      type: mongoose.Schema.ObjectId,
      ref: "department",
      required: [true, "department is Required"],
    },
    division: {
      type: mongoose.Schema.ObjectId,
      ref: "division",
      required: [false, "division is Required"],
    },
    location: {
      type: mongoose.Schema.ObjectId,
      ref: "LocationBuilding",
      required: [true, "location is required"]
    },
    shift: {
      type: mongoose.Schema.ObjectId,
      ref: "ShiftSchedule",
    },
    created_by: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    created_date: {
      type: Date,
      default: new Date(),
    },
    attachment: {
      type: String,
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
  { collection: "internalUser" }
);

const InternalUser = mongoose.model("InternalUser", internalUserSchema);
module.exports = { InternalUser, internalUserSchema};
