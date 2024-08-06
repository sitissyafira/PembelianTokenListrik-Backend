const mongoose = require('mongoose');
const CurrencySchema = new mongoose.Schema({

    currency : {
        type: String,
        required : [true, "currency is required"]
    },
    region : {
      type: String,
      required : [true, "Tax % is required"]
    },
    value : {
      type: Number,
      required: [true, "Nominal is required"]
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
    update_by: String,
    update_date: Date
}, {collection: 'currency'});

const Currency = mongoose.model("Currency", CurrencySchema);
module.exports = {Currency, CurrencySchema};