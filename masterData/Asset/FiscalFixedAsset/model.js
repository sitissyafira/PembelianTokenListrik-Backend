const mongoose = require("mongoose");
const FiscalFixedAssetSchema = new mongoose.Schema(
  {
    fiscalName: {
      type: String,
      required: [true, "Fiscal Fixed Asset Type Name is required"],
    },
    description: {
      type: String,
      required: [true, "Fiscal Depreciation Method is required"],
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Created By is Required"],
    },
    createdDate: {
      type: Date,
      required: [false, "Created By is Required"],
      default: Date.now(),
    },
    updateBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [false, "Created By is Required"],
    },
    updateDate: {
      type: Date,
      default: Date.now(),
      required: [false, "Created By is Required"],
    },
  },
  { collection: "fiscalasset" }
);

const Fiscalasset = mongoose.model("Fiscalasset", FiscalFixedAssetSchema);
module.exports = {Fiscalasset, FiscalFixedAssetSchema};
