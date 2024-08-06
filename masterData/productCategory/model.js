const mongoose = require("mongoose");
const ProductCategorySchema = new mongoose.Schema({
    category_code: {
        type: String,
        required: [true, "Category code required"]
    },
    category_name: {
        type: String,
        required: [true, "Category name is required"]
    },
    description: {
        type: String,
        required: false
    },
    created_by: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false
    },
    created_date: {
        type: Date,
        default: Date.now()
    },
    update_by: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false
    },
    update_date: {
        type: Date,
        default: Date.now()
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, {
    collection: 'masterCategoryProduct'
});

const ProductCategory = mongoose.model("ProductCategory", ProductCategorySchema);
module.exports = {
    ProductCategory,
    ProductCategorySchema
};