const mongoose = require("mongoose");

const FixedAssetSchema = new mongoose.Schema(
  {
    fixedAssetTypeName: {
      type: String,
      required: [true, "Fixed Asset Name is required"],
    },
    fiscalFixedType: {
      type: mongoose.Schema.ObjectId,
      ref: "Fiscalasset",
      required: [true, "Fiscal Fixed Type is Required"],
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
  { collection: "fixedasset" }
);

const Fixedasset = mongoose.model("Fixedasset", FixedAssetSchema);
module.exports = {Fixedasset, FixedAssetSchema};
