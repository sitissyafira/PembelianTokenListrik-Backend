const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const departmentSchema = new mongoose.Schema (
    {
        department_id: {
            type: String,
            require: [true, 'department_code is required']
        },
        department_name: {
            type: String,
            require: [true, 'department_name is required']
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
    }, {collection:'department'}
);

const department = mongoose.model("department", departmentSchema);
module.exports = {department, departmentSchema};