/**
 *
 * @type {Unit Rate Schema | Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UnitRateSchema = new Schema({
    unit_rate_name: {
        type: String,
        required : [false, 'rate name is required'],
    },
    service_rate : {
        type : Number,
        required : [false, 'service rate is required'],
    },
    sinking_fund : {
        type : Number,
        required : [false, 'sinking fund is required']
    },
    overstay_rate : {
        type : Number,
        required : [false, 'overstay rate is required']
    },
    rentPrice : {
        type : Number,
        required: [false, 'rentPrice is required']
    },
    isRent: Boolean,
}, {collection: 'tblmunitrate'});

const UnitRate = mongoose.model("UnitRate", UnitRateSchema);
module.exports = {UnitRate, UnitRateSchema};

