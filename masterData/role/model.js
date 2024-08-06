const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  roleCode:{
    type: String,
    required: [false, 'Role Code is Required']
  },
  role:{
    type: String,
    required: [false, 'Description is Required']
  },
  active:{
    type: Boolean,
    required: [false, 'End Effective Date is Required']
  },
  delete:{
    type: Boolean,
    default: false
  },
  createdDate:{
    type: Date,
    required: [false, 'Created Date is Required'],
    default: Date.now()
  },
  createdBy:{
    type: Schema.ObjectId,
    ref: 'User',
    required: [false, 'Created By is Required']
  },
  updatedDate:{
    type: Date
  },
  updatedBy:{
    type: String
  },
  current_login:{
    type: Number,
    default: 0
  },
  max_login:{
    type:Number
  }
},{collection: 'role'});

const Role = mongoose.model("Role", RoleSchema);
module.exports = {Role, RoleSchema};