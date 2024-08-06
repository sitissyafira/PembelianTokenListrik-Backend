/**
 *
 * @type {Pnltyrate Schema | Mongoose}
 */

const mongoose = require('mongoose');

const PnltyRateSchema = new mongoose.Schema({
    rateName : {
        type: String,
        required : [true, "Rate Name is required"]
    },
    rate : {
      type: Number,
      required : [true, "Rate is required"]
    },
    periode : {
      type: String,
      required : [true, "Periode is required"]
    },
    remarks : {
      type: String
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Created By is Required']
    },
    createdDate: {
      type: Date,
      default: Date.now()
    },
    updateBy: String,
    updateDate: Date
}, {collection: 'pnltyrate'});

const Pnltyrate = mongoose.model("Pnltyrate", PnltyRateSchema);
module.exports = Pnltyrate;