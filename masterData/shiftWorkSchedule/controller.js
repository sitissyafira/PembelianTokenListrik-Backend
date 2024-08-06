const errorHandler = require("../../controllers/errorController");
const catchAsync = require("../../utils/catchAsync");
const excel = require("exceljs");
const readXlsxFile = require("read-excel-file/node");
const { ShiftSchedule } = require("./model")
const jwt = require("jsonwebtoken");
const { secret } = require("../../config");
const {
    listShiftSchedule,
    listShiftScheduleMobile,
    findUserDivision
} = require("./service")

exports.create = async (req, res, next) => {
    try{
        //create user internal

        const create = await ShiftSchedule.create(req.body)

        return res.status(200).json({
            status: "success",
            data: create
        })
    }
    catch(e){
        console.log(e)
        return res.status(500).json({
            status: "failed",
            msg: e
        })
    }
};

exports.getShiftById = async (req, res, next) => {
    try{
        //create user internal

        const data = await ShiftSchedule.findById(req.params.id)

        return res.status(200).json({
            status: "success",
            data: data
        })
    }
    catch(e){
        console.log(e)
        return res.status(500).json({
            status: "failed",
            msg: e
        })
    }
};

exports.shiftListMobile = async function (req, res, next) {
    try {

      //find role by decode jwt
      const filter = JSON.parse(req.query.filter)

      let queryFilter = {}

      //find division
      let division = await findUserDivision(filter.user, filter.role)

      queryFilter = {
        division: division.division
      }

      const allData = await listShiftScheduleMobile(queryFilter, 1, 0);
      
      return res.status(200).json({
        status: "success",
        data: allData,
      });
    
    } catch (e) {
      console.log(e);
    }
  }
exports.shiftList = async function (req, res, next) {
    try {
      const str = JSON.parse(req.query.param);
      const allData = await listShiftSchedule({}, 1, 0);
      let query = {};
      if (str.filter !== null) query = { name: str.filter.name };
      const shiftSchedule = await listShiftSchedule(query, str.pageNumber, str.limit);
      if (shiftSchedule) {
        return res.status(200).json({
          status: "success",
          data: shiftSchedule,
          totalCount: allData.length,
        });
      } else {
        return res
          .status(500)
          .json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      console.log(e);
    }
  }

exports.updateById = async (req, res, next) => {
    try{
        //create user internal

        const create = await ShiftSchedule.findByIdAndUpdate(req.params.id, req.body)

        return res.status(200).json({
            status: "success",
            data: create
        })
    }
    catch(e){
        console.log(e)
        return res.status(500).json({
            status: "failed",
            msg: e
        })
    }
};

exports.deleteById = async (req, res, next) => {
  try{
      //create user internal

      const create = await ShiftSchedule.findByIdAndDelete(req.params.id)

      return res.status(200).json({
          status: "success",
          data: create
      })
  }
  catch(e){
      console.log(e)
      return res.status(500).json({
          status: "failed",
          msg: e
      })
  }
};