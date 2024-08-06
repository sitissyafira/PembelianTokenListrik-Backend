const mongoose = require("mongoose");

//this is mainly for absensi purpose
const shiftScheduleSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: [true, "Name is Required"],
    },
    start_schedule: {
        type: String,
        required: [true, 'start schedule is required'],
    },
    end_schedule: {
        type: String,
        required: [true, 'end schedule is required'],
    },
    department: {
        type: mongoose.Schema.ObjectId,
        ref: "department",
        required: [false, "department is Required"],
      },
    division: {
        type: mongoose.Schema.ObjectId,
        ref: "division",
        required: [false, "division is Required"],
    },
    status: {
        type: Boolean,
        default: true,
    }
  },
  { collection: "mShiftSchedule" }
);

const ShiftSchedule = mongoose.model("ShiftSchedule", shiftScheduleSchema);
module.exports = { ShiftSchedule, shiftScheduleSchema};
