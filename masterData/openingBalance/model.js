const mongoose = require('mongoose');
const BalanceSchema = new mongoose.Schema (
    {
        typeAccount : {
            type: mongoose.Schema.ObjectId,
            ref: 'acctype',
            require: [true, 'Type Account is required']
        },
        coa : {
            type: mongoose.Schema.ObjectId,
            ref: 'acct',
            require: [true, 'COA is required']
        },
        opening_balance : {
            type: Number,
            require: [true, 'Nominal is required']
        },
        remark : {
            type: String,
            require: [true, 'Remark is required']
        },
        createdBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Created By is Required']
        },
        createdDate: {
            type: Date,
            default: Date.now(),
        },
        updateBy: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
        isDelete : {
            type : Boolean,
            required : [false, 'visitor is required'],
            default: false
        },
        updateDate: Date
    }, {collection: 'balance'}
);

const Balance = mongoose.model("Balance", BalanceSchema);
module.exports = {Balance, BalanceSchema};