const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const vendorSchema = new mongoose.Schema (
    {
        vendor_name: {
            type: String,
            require: [true, 'vendor_name is required']
        },
        address: {
            type: String,
            require: [true, 'type_name is required']
        },
        vendor_code:{
            type: Number,
            require: [false, 'vendor_code is required']
        },
        npwp: {
            type: Number,
            require: [true, 'NPWP is required']
        },
        phone: {
            type: Number,
            require:[true, 'phone is required']
        },
        vendor_email: {
            type: String,
            require: [true, 'vendor_email is required']
        },
        vendor_category: {
            type: Schema.Types.ObjectId,
            ref: 'vendorCategory',
            require: [true, 'vendor_category is required']
        },
        pic: {
            type: String,
            require: [true, 'pic is required']
        },
        pic_phone: {
            type:Number,
            require: [true, 'pic_phone is required']
        },
        pic_email: {
            type: String,
            require: [true, 'pic_email is required']
        },
        remark: {
            type: String,
            require: [false, 'remark is required']
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
        },
        products: {
            type: [mongoose.Schema.ObjectId],
            ref: "ProductBrand",
            required: [true, "products is required"]
        }
    }, {collection:'vendor'}
);

const vendor = mongoose.model("vendor", vendorSchema);
module.exports = {vendor, vendorSchema};