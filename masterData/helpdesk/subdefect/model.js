/**
 *
 * @type {SubDefect Schema| Mongoose}
 */

const mongoose = require('mongoose');
const { Category } = require('../category/model');
const Schema = mongoose.Schema;
const Defect = require("../defect/model").Defect;

const SubDefectSchema = new Schema({
    subdefectid: {
        type: String,
        required: [false, "ID is required"]
    },
    subtype: {
        type: String,
        required: [false, "Name is required"]
    },
    defect: {
        type: Schema.Types.ObjectId,
        required: [false, "ticket_id is required"],
        ref : Defect
    },
    category: {
        type: Schema.Types.ObjectId,
        required: [false, "ticket_id is required"],
        ref : Category
    },
    priority: {
        type: String,
        required: [false, "Detail is required"]
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [false, "Created By is required"]
    },
    createdDate: {
        type: Date,
        required: [false, "This field is required"],
        default: Date.now()
    },
    updateBy: String,
    updateDate: Date
}, {collection: 'subdefect'});

SubDefectSchema.set('toObject', { virtuals: true });
SubDefectSchema.set('toJSON', { virtuals: true });

SubDefectSchema.virtual('Defect', {
    ref: 'Defect',
    localField: 'id_defect',
    foreignField: 'subdefectid',
    justOne: true
})

const SubDefect = mongoose.model("SubDefect", SubDefectSchema);
module.exports = {SubDefect, SubDefectSchema};