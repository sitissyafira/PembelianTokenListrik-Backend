const mongoose = require('mongoose');
const BillingBankSchema = new mongoose.Schema({

    bankCode: {
        type: String,
        required: [true, 'Bank Code is required']
    },
    bankName: {
        type: String,
        required: [true, "Bank Name is required"]
    },
    bankAccount: {
        type: String,
        required: [true, "Bank Account is required"]
    },
    bankNumber: {
        type: String,
        required: [true, "Bank Number is required"]
    },
    isActive: {
        type: Boolean,
        required: [true, "Active is required"],
        default: true
    },
    isDelete: {
        type: Boolean,
        required: [true, "isDelete is required"],
        default: false
    },
    createBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, "Created By is required"]
    },
    createDate: {
        type: Date,
        default: Date.now()
    },

    updateBy: mongoose.Schema.ObjectId,
    updateDate: Date

}, { collection: "billingbank"});

const BillingBank = mongoose.model("BillingBank", BillingBankSchema);
module.exports = { BillingBank, BillingBankSchema }

