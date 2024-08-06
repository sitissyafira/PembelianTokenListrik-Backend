const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const mUserSchema = new mongoose.Schema (
    {
        user_id : {
            type: String,
            require: [false, 'user_id is required']
        },
        nip : {
            type: String,
            require: [true, 'NIP is required']
        },
        full_name: {
            type: String,
            require: [true, 'full_name is required']
        },
        username: {
            type: String,
            require: [true, 'username is required']
        },
        gender: {
            type: String,
            enum: ['pria', 'wanita'],
            require: [true, 'gender is required']
        },
        email: {
            type: String,
            require: [false, 'email is required']
        },
        phone: {
            type: Number,
            require: [false, 'phone number is required']
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: 'Role',
            require: [false, 'role is required']
        },
        department: {
            type: Schema.Types.ObjectId,
            require: [false, 'department is required'],
            ref: 'department',
        },
        division: {
            type: Schema.Types.ObjectId,
            require: [false, 'division is required'],
            ref: 'division',
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
    }, {collection:'usermaster'}
);
const mUser = mongoose.model("usermaster", mUserSchema);
module.exports = {mUser, mUserSchema};