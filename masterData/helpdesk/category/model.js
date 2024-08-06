// /**
//  *
//  * @type {Category Schema| Mongoose}
//  */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    categoryid: {
        type: String,
        required: [true, "categoryid is required"]
    },
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Created By is Required']
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    updateBy: String,
    updateDate: Date
}, {collection: 'category'});

const Category = mongoose.model("Category", CategorySchema);
module.exports = {Category, CategorySchema};