const division = require("./model").division;
const department = require("../department/model").department;
const LogFinance = require("../../logHistory/logFinance/model");
const services = require("../../services/handlerFactory");
const errorHandler = require("../../controllers/errorController");
const servicesFactory = require("../../services/handlerFactory");
const catchAsync = require("../../utils/catchAsync");
const excel = require("exceljs");
const readXlsxFile = require("read-excel-file/node");

// exports.create = servicesFactory.createOne(division);
exports.getById = servicesFactory.getOne(division);
// exports.update = servicesFactory.updateOne(division);
exports.delete = servicesFactory.deleteOne(division);

exports.create = async (req, res, next) => {
  try {
    const dates = new Date();
    const create = await division.create(req.body);

    if (create) {
      const updateLog = await LogFinance({
        menu: "division",
        data: create,
        year: dates.getFullYear(),
      }).save();
      res.status(200).json({
        status: "success",
        data: create,
        totalCount: create.length,
      });
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return errorHandler(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const skip = (req.query.pageNumber - 1) * req.query.limit;
    let data;

    if (req.query.search === undefined || req.query.search === null || req.query.search === "") {
      data = await division
        .find({ isDelete: false })
        .populate("department", "-__v")
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .sort({ $natural: 1 });
    } else {
      const filterSearch = { isDelete: false, division_name: { $regex: req.query.search } };
      data = await division
        .find(filterSearch)
        .populate("department", "-__v")
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .sort({ $natural: 1 });
    }
    res.status(200).json({
      status: "success",
      totalCount: data.length,
      data,
    });
  } catch (error) {
    console.log(error);
    return errorHandler(error);
  }
};

exports.deleteFlag = async (req, res, next) => {
  try {
    const update = { isDelete: true };
    const delFlag = await division.findByIdAndUpdate(req.params.id, update);
    res.status(200).json({
      status: "Delete Success!",
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const date = new Date();
    date.setHours(date.getHours() + 7);
    req.body.updateDate = date;
    const update = await division.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (update) {
      const updatelog = await LogFinance({
        menu: "division",
        data: update,
        year: date.getFullYear(),
      }).save();
    }

    res.status(200).json({
      status: "success",
      data: update,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.DownloadFormatXlxs = async (req, res, next) => {
  let workbook = new excel.Workbook();
  workbook.created = new Date();
  workbook.modified = new Date();
  let worksheet = workbook.addWorksheet("division master");
  var worksheetDepartment = workbook.addWorksheet("department");
  worksheet.columns = [
    { header: "uniqueid", key: "id", hidden: true },
    { header: "Division Name", key: "division_name" },
    { header: "Division Code", key: "division_code" },
    { header: "Department", key: "department" },
    { header: "Description", key: "description" },
  ];
  const data = await division.find({ isDelete: false }).populate("department", "-__v");
  data.forEach((e) => {
    console.log(e);
    const row = {
      id: e._id,
      division_name: e.division_name,
      division_code: e.division_code,
      department: e.department.department_name,
      description: e.description,
    };
    worksheet.addRow(row);
  });

  worksheetDepartment.columns = [
    { header: "uniqueid", key: "id", hidden: true },
    { header: "Department Name", key: "department_name" },
  ];
  const dptment = await department.find({ isDelete: false });
  dptment.forEach((e) => {
    const rowtype = { id: e._id, department_name: e.department_name };
    worksheetDepartment.addRow(rowtype);
  });

  res.setHeader("Content-Type", "application/vnd.openxmlformats");
  res.setHeader("Content-Disposition", "attachment; filename=" + "division_master.xlsx");
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
};

exports.UploadFormatXlxs = async (req, res, next) => {
  try {
    let addData;
    const file = req.file;
    console.log(file);
    if (file === undefined) {
      res.status(400).json({
        status: "Failed",
        message: "Please upload an xlsx file",
      });
    } else {
      const filePath = file.path;
      let createdBy = req.body.created_by;
      readXlsxFile(filePath).then((rows) => {
        if (rows.length <= 1) {
          res.status(400).json({
            status: "Failed",
            message: "Data is empty",
          });
        } else {
          rows.forEach(async (element, index) => {
            if (index > 0) {
              if (typeof element[0] !== "object") {
                var check = await division.findOne({
                  _id: element[0].replace(/"+/gi, ""),
                });

                if (check) {
                  if (
                    element[0] == check._id &&
                    element[1] == check.division_name &&
                    element[2] == check.division_code &&
                    element[3] == check.department
                  ) {
                  } else {
                    var getDepartment = await department.find({ department_name: element[3] });
                    update = await division.findByIdAndUpdate(
                      {
                        _id: element[0].replace(/"+/gi, ""),
                      },
                      {
                        division_name: element[1],
                        division_code: element[2],
                        department: getDepartment[0]._id,
                        description: element[4],
                        created_by: createdBy,
                      }
                    );
                  }
                }
              } else {
                var getDepartment = await department.find({ department_name: element[3] });
                const dataTax = {
                  division_name: element[1],
                  division_code: element[2],
                  department: getDepartment[0]._id,
                  created_by: createdBy,
                };
                addData = await division.create(dataTax);
              }
            }
          });
          res.status(200).json({
            status: "import success!",
          });
        }
      });
    }
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};
