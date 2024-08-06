const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Floor = require("./../floor/model").Floor;

const UnitSchema = new Schema(
  {
    cdunt: {
      type: String,
      required: [false, "cdunt is required"],
    },
    nmunt: {
      type: String,
      required: [false, "nmunt is required"],
    },
    untnum: {
      type: String,
      required: [false, "untnum is required"],
    },
    unttp: {
      type: Schema.Types.ObjectId,
      required: [false, "unttp is required"],
    },
    untrt: {
      type: Schema.Types.ObjectId,
      required: [false, "untrt is required"],
    },
    type: {
      type: String,
      required: [false, "untnum is required"],
      default: "owner",
    },
    wtrmtr: {
      type: Schema.Types.ObjectId,
      required: [false, "untrt is required"],
      ref: "Water",
    },
    pwrmtr: {
      type: Schema.Types.ObjectId,
      required: [false, "untrt is required"],
      ref: "Power",
    },
    untsqr: {
      type: Number,
      required: [false, "untsqr is required"],
    },
    flr: {
      type: Schema.Types.ObjectId,
      required: [false],
      ref: Floor,
    },
    // rate: {
    //     type: Number,
    //     required: [false, 'rate is required']
    // },
    srvcrate: {
      type: Number,
      required: [false, "srvcrate is required"],
    },
    sinkingfund: {
      type: Number,
      required: [false, "sinkingfund is required"],
      default: 0,
    },
    ovstyrate: {
      type: Number,
      required: [false, "ovstyrate is required"],
      default: 0,
    },
    price: {
      type: Number,
      required: [false, "price is required"],
      default: 0,
    },
    rentalPrice: {
      type: Number,
      required: [false, "rentPrice is required"],
      default: 0,
    },
    deposit: {
      type: Object,
      required: false,
    },
    isChild: {
      type: Boolean,
      required: [true, "isChild is required"],
      default: false,
    },
    isSewa: {
      type: Boolean,
      default: false,
    },
    periodeBill: {
      type: String, // "monthly" & "daily"
    },
  },
  { collection: "tblmunit" }
);

const Unit = mongoose.model("Unit", UnitSchema);
module.exports = { Unit, UnitSchema };
