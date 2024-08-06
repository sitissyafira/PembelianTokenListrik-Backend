const mongoose = require("mongoose");

//this is mainly for absensi purpose
const locationBuildingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name Employee is Required"],
    },
    address: {
      type: String,
      required: [false, "email is Required"],
    },
    latitude: {
      type: Number,
      required: [true, "latitude required"]
    },
    longitude: {
      type: Number,
      required: [true, "longitude required"]
    },
    //radius store as meter
    radius: {
      type: Number,
      required: [true, "longitude required"]
    },
    status: {
      type: Boolean,
      required: [false, "status required"],
      default: true
    },
    created_by: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    created_date: {
      type: Date,
      default: new Date(),
    },
    location: {
      type: String,
    }
  },
  { collection: "mLocationBuilding" }
);

const LocationBuilding = mongoose.model("LocationBuilding", locationBuildingSchema);
module.exports = { LocationBuilding, locationBuildingSchema };
