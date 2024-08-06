const mongoose = require("mongoose")
const ProductBrandSchema = new mongoose.Schema({
    brand_code: {
        type: Number,
        required: [true, "Brand code is required"]
    },
    brand_name: {
        type: String,
        required: [true, "Brand name is required"]
    },
    product_category: {
        type: mongoose.Schema.ObjectId,
        ref: 'ProductCategory',
        required: [true, "Product category is required"]
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
        ref: 'User'
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
    collection: 'masterProductBrand'
});

const ProductBrand = mongoose.model("ProductBrand", ProductBrandSchema);
module.exports = {
    ProductBrand,
    ProductBrandSchema
}