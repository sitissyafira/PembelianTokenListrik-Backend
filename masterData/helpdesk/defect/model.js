// /**
//  *
//  * @type {Defect Schema| Mongoose}
//  */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DefectSchema = new Schema({
    defectid: {
        type: String,
        required: [false, "ID is required"]
    },
    category: {
        type: Schema.Types.ObjectId,
        required: [false, "ticket_id is required"],
        // ref : Category
    },
    defect_name: {
        type: String,
        required: [false, "Detail is required"]
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [false, "This field is required"]
    },
    createdDate: {
        type: Date,
        required: [false, "This field is required"],
        default: Date.now()
    }
}, {collection: 'defect'});

DefectSchema.set('toObject', { virtuals: true });
DefectSchema.set('toJSON', { virtuals: true });

DefectSchema.virtual('Category', {
    ref: 'Category',
    localField: 'id_category',
    foreignField: 'defectid',
    justOne: true
})

const Defect = mongoose.model("Defect", DefectSchema);
module.exports = {Defect, DefectSchema};