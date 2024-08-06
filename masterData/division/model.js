const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const divisionSchema = new mongoose.Schema (
    {
        division_code: {
            type: Number,
            require: [true, 'division_code is required']
        },
        division_name: {
            type: String,
            require: [true, 'division_name is required']
        },
        department: {
            type: Schema.Types.ObjectId,
            require: [true, 'department is required'],
            ref: "department",
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
    }, {collection:'division'}
);

const division = mongoose.model("division", divisionSchema);
module.exports = {division, divisionSchema};