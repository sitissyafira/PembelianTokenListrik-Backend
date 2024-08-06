const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const vendorCategorySchema = new mongoose.Schema (
    {
        category_name: {
            type: String,
            require: [true, 'categoryName is Required']
        },
        description: {
            type: String,
            require: [false, 'description is required']
        },
        created_by: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "created_by is Required"],
          },
          created_date: {
            type: Date,
            default: Date.now(),
            required: [true, "created_date is Required"],
          },
          updated_by: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: false
          },
          updated_date: {
              type: Date,
              default: Date.now(),
              required: false,
            },
          isDelete: {
              type: Boolean,
              default: false,
              required: [true, "isDelete is Required"]
          }
    }, {collection: 'vendorCategory'}
);

const vendorCategory = mongoose.model("vendorCategory", vendorCategorySchema);
module.exports = {vendorCategory, vendorCategorySchema};