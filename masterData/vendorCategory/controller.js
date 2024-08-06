const vendorCategory = require("./model").vendorCategory;
const vendorCategoryLog = require("../../logHistory/mVendorCategory/model").vendorCategoryLog;
const LogFinance = require("../../logHistory/logFinance/model");
const services = require("../../services/handlerFactory");
const errorHandler = require("../../controllers/errorController");
const servicesFactory = require("../../services/handlerFactory");
const catchAsync = require("../../utils/catchAsync");
const excel = require("exceljs");
const readXlsxFile = require("read-excel-file/node");
const dateFormat = require("dateformat");

// exports.create = servicesFactory.createOne(vendorCategory);
exports.getById = servicesFactory.getOne(vendorCategory);
exports.update = servicesFactory.updateOne(vendorCategory);
exports.delete = servicesFactory.deleteOne(vendorCategory);

exports.create = async (req, res, next) => {
  try {
    const dates = new Date();
    const create = await vendorCategory.create(req.body);

    if (create) {
      const updateLog = await LogFinance({
        menu: "vendorCategory",
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
      data = await vendorCategory
        .find({ isDelete: false })
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .sort({ $natural: 1 });
    } else {
      data = await vendorCategory
        .find({ isDelete: false })
        .and({ category_name: req.query.search })
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
    const delFlag = await vendorCategory.findByIdAndUpdate(req.params.id, update);
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

    const update = await vendorCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (update) {
      const updateLog = await LogFinance({
        menu: "vendorCategory",
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
  let worksheet = workbook.addWorksheet("vendor_category master");
  worksheet.columns = [
    { header: "uniqueid", key: "id", hidden: true },
    { header: "Category Name", key: "category_name" },
    { header: "Description", key: "description" },
  ];
  const data = await vendorCategory.find({ isDelete: false });
  data.forEach((e) => {
    const row = {
      id: e._id,
      category_name: e.category_name,
      description: e.description,
    };
    worksheet.addRow(row);
  });

  res.setHeader("Content-Type", "application/vnd.openxmlformats");
  res.setHeader("Content-Disposition", "attachment; filename=" + "vendor_catory_master.xlsx");
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
};

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
                var check = await vendorCategory.findOne({
                  _id: element[0].replace(/"+/gi, ""),
                });
                if (check) {
                  if (
                    element[0] == check._id &&
                    element[1] == check.category_name &&
                    element[2] == check.description
                  ) {
                  } else {
                    update = await vendorCategory.findByIdAndUpdate(
                      {
                        _id: element[0].replace(/"+/gi, ""),
                      },
                      {
                        category_name: element[1],
                        description: element[2],
                        created_by: createdBy,
                      }
                    );
                  }
                }
              } else {
                const dataTax = {
                  category_name: element[1],
                  description: element[2],
                  created_by: createdBy,
                };
                addData = await vendorCategory.create(dataTax);
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
