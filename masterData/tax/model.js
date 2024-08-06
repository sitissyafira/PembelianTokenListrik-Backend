const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TaxSchema = new mongoose.Schema({

  tax_code: {
    type: String,
    required: [true, "Tax Code is required"]
  },
  tax_name: {
    type: String,
    required: [true, "Tax % is required"]
  },
  nominal: {
    type: Number,
    required: [true, "Nominal is required"]
  },
  remarks: {
    type: String
  },
  created_by: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Created By is Required']
  },
  created_date: {
    type: Date,
    default: Date.now()
  },
  isDelete: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
  },
  update_by: String,
  update_date: Date
}, { collection: 'tax' });

const Tax = mongoose.model("Tax", TaxSchema);
module.exports = { Tax, TaxSchema };