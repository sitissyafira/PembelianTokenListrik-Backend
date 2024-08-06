const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountCategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Account Category Name is Required']
  },
  account: [{
    type: Schema.Types.ObjectId,
    required: [false],
  }],
  createdDate: {
    type: Date,
    required: [true, "Create By is Required"]
  },
  updatedDate: {
    type: Date,
    required: [false]
  },
  isDelete: {
    type: Boolean,
    required: [false],
    default: false
  },
}, { collection: 'acc_category' });

const AccountCategory = mongoose.model("AccountCategory", AccountCategorySchema);
module.exports = { AccountCategory, AccountCategorySchema };