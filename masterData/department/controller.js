const department = require("./model").department;
const departmentLog = require("../../logHistory/mDepartment/model").departmentLog;
const LogFinance = require("../../logHistory/logFinance/model");
const services = require("../../services/handlerFactory");
const servicesFactory = require("../../services/handlerFactory");
const catchAsync = require("../../utils/catchAsync");
const errorHandler = require("../../controllers/errorController");
const excel = require("exceljs");
const readXlsxFile = require("read-excel-file/node");
const dateFormat = require("dateformat");

// exports.create = servicesFactory.createOne(department);
exports.getById = servicesFactory.getOne(department);
// exports.update = servicesFactory.updateOne(department);
exports.delete = servicesFactory.deleteOne(department);

exports.create = async (req, res, next) => {
  try {
    const dates = new Date();
    const create = await department.create(req.body);

    if (create) {
      const updateLog = await LogFinance({
        menu: "department",
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
      data = await department
        .find({ isDelete: false })
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .sort({ $natural: 1 });
    } else {
      const filterSearch = { isDelete: false, department_name: { $regex: req.query.search } };
      data = await department
        .find(filterSearch)
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
    const delFlag = await department.findByIdAndUpdate(req.params.id, update);
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

    const update = await department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (update) {
      const updateLog = await LogFinance({
        menu: "department",
        data: update,
        year: date.getFullYear(),
      }).save();
    }

    res.status(200).json({
      status: "success, data has been update",
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
  let worksheet = workbook.addWorksheet("department master");
  worksheet.columns = [
    { header: "uniqueid", key: "id", hidden: true },
    { header: "Department Id", key: "department_id" },
    { header: "Department Name", key: "department_name" },
    { header: "Description", key: "description" },
  ];
  const data = await department.find({ isDelete: false });
  data.forEach((e) => {
    const row = {
      id: e._id,
      department_id: e.department_id,
      department_name: e.department_name,
      description: e.description,
    };
    worksheet.addRow(row);
  });

  res.setHeader("Content-Type", "application/vnd.openxmlformats");
  res.setHeader("Content-Disposition", "attachment; filename=" + "department_master.xlsx");
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
};

/**
 * @param { created_by: Object ID }
 * @description Created by params for validation.
 */
exports.UploadFormatXlxs = async (req, res, next) => {
  try {
    let addData;
    const file = req.file;
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
                var check = await department.findOne({
                  _id: element[0].replace(/"+/gi, ""),
                });
                if (check) {
                  if (
                    element[0] == check._id &&
                    element[1] == check.department_id &&
                    element[2] == check.department_name
                  ) {
                  } else {
                    update = await department.findByIdAndUpdate(
                      {
                        _id: element[0].replace(/"+/gi, ""),
                      },
                      {
                        department_id: element[1],
                        department_name: element[2],
                        created_by: createdBy,
                      }
                    );
                  }
                }
              } else {
                const dataDepartment = {
                  department_id: element[1],
                  department_name: element[2],
                  created_by: createdBy,
                };
                addData = await department.create(dataDepartment);
              }
            }
          });
          res.status(200).json({
            status: "import success!",
            msg: "Berhasil",
          });
        }
      });
    }
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};
