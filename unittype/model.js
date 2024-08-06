/**
 *
 * @type {Unit Type Schema | Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UnitTypeSchema = new Schema({
    unttp: {
        type: String,
        required: [false, "unttp is required"]
    },
    untsqr: {
        type: Number,
        required: [false, "untsqr is required"]
    },
}, {collection: 'tblunttp'});

const UnitType = mongoose.model("UnitType", UnitTypeSchema);
module.exports = {UnitType, UnitTypeSchema};