const vendor = require("./model").vendor;
const vendorCategory = require("../vendorCategory/model").vendorCategory;
const LogFinance = require("../../logHistory/logFinance/model");
const vendorLog = require("../../logHistory/mVendor/model").vendorLog;
const Sequence = require("../../models/sequence");
const services = require("../../services/handlerFactory");
const errorHandler = require("../../controllers/errorController");
const servicesFactory = require("../../services/handlerFactory");
const catchAsync = require("../../utils/catchAsync");
const excel = require("exceljs");
const readXlsxFile = require("read-excel-file/node");
const dateFormat = require("dateformat");

function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

exports.generateCodeVendor = async (req, res, next) => {
  try {
    const dates = new Date();
    const month = ("0" + (dates.getMonth() + 1)).slice(-1);
    const date = ("0" + dates.getDate()).slice(-2);
    const year = dates.getFullYear().toString().substr(-2);
    var code = "";

    const sequences = await Sequence.find({
      menu: "vendor",
      year: dates.getFullYear(),
    });

    //console.log(sequences);
    //add rehan fixing Vendor Numbering 20211023
    if (sequences.length == 0) {
      const newNumber = pad(1, 5);
      code = newNumber;

      const create = await Sequence.create({
        menu: "vendor",
        sequence: 1,
        year: dates.getFullYear(),
      });
    } else {
      const seq = sequences[0].sequence + 1;
      const newNumber = pad(seq, 5);
      code = newNumber;

      const updateSequence = await Sequence.findByIdAndUpdate(
        { _id: sequences[0]._id },
        { sequence: seq }
      );
    }

    // const newNumber = pad(sequences[0].sequence, 5);
    // const code =   newNumber;
    // const updateSequence = await Sequence.findByIdAndUpdate(
    //     { _id: sequences[0]._id },
    //     { sequence: sequences[0].sequence + 1 }
    //   );

    res.status(200).json({
      status: "success",
      data: code,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

// exports.create = servicesFactory.createOne(vendor);
exports.getById = servicesFactory.getOne(vendor, {path: "products", model: "ProductBrand"});
exports.update = servicesFactory.updateOne(vendor);
exports.delete = servicesFactory.deleteOne(vendor);

exports.create = async (req, res, next) => {
  try {
    const date = new Date();
    const create = await vendor.create(req.body);

    if (create) {
      const updateLog = await LogFinance({
        menu: "vendor",
        data: create,
        year: date.getFullYear(),
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
      data = await vendor
        .find({ isDelete: false })
        .populate("vendor_category", "-__v")
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .sort({ $natural: 1 });
    } else {
      data = await vendor
        .find({ isDelete: false })
        .and({ vendor_name: req.query.search })

        .populate("vendor_category", "-__v")
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
    const delFlag = await vendor.findByIdAndUpdate(req.params.id, update);
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

    const update = await vendor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (update) {
      const updateLog = await LogFinance({
        menu: "vendor",
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
  let worksheet = workbook.addWorksheet("vendor master");
  var worksheetVendorCategory = workbook.addWorksheet("vendor Category");
  worksheet.columns = [
    { header: "uniqueid", key: "id", hidden: true },
    { header: "Vendor Name", key: "vendor_name" },
    { header: "Vendor Code", key: "vendor_code" },
    { header: "Address", key: "address" },
    { header: "Phone", key: "phone" },
    { header: "Vendor Email", key: "vendor_email" },
    { header: "Vendor Category", key: "vendor_category" },
    { header: "PIC", key: "pic" },
    { header: "PIC Phone", key: "pic_phone" },
    { header: "PIC Email", key: "pic_email" },
    { header: "Remark", key: "remark" },
  ];
  const data = await vendor.find({ isDelete: false }).populate("vendor_category", "-__v");
  data.forEach((e) => {
    console.log(e);
    const row = {
      id: e._id,
      vendor_name: e.vendor_name,
      vendor_code: e.vendor_code,
      address: e.address,
      phone: e.phone,
      vendor_email: e.vendor_email,
      vendor_category: e.vendor_category.category_name,
      pic: e.pic,
      pic_phone: e.pic_phone,
      pic_email: e.pic_email,
    };
    worksheet.addRow(row);
  });

  worksheetVendorCategory.columns = [
    { header: "uniqueid", key: "id", hidden: true },
    { header: "Vendor Category", key: "category_name" },
  ];
  const vCategory = await vendorCategory.find();
  vCategory.forEach((e) => {
    const rowtype = { id: e._id, category_name: e.category_name };
    worksheetVendorCategory.addRow(rowtype);
  });

  res.setHeader("Content-Type", "application/vnd.openxmlformats");
  res.setHeader("Content-Disposition", "attachment; filename=" + "vendor_master.xlsx");
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
                var check = await vendor.findOne({
                  _id: element[0].replace(/"+/gi, ""),
                });

                if (check) {
                  if (
                    element[0] == check._id &&
                    element[1] == check.vendor_name &&
                    element[2] == check.vendor_code &&
                    element[3] == check.address &&
                    element[4] == check.phone &&
                    element[5] == check.vendor_email &&
                    element[6] == check.vendor_category &&
                    element[7] == check.pic &&
                    element[8] == check.pic_phone &&
                    element[9] == check.pic_email
                  ) {
                  } else {
                    var getVendorCategory = await vendorCategory.find({
                      category_name: element[6],
                    });
                    update = await vendor.findByIdAndUpdate(
                      {
                        _id: element[0].replace(/"+/gi, ""),
                      },
                      {
                        vendor_name: element[1],
                        vendor_code: element[2],
                        address: element[3],
                        phone: element[4],
                        vendor_email: element[5],
                        pic: element[7],
                        pic_phone: element[8],
                        pic_email: element[9],
                        vendor_category: getVendorCategory[0]._id,
                        created_by: createdBy,
                      }
                    );
                  }
                }
              } else {
                var getVendorCategory = await vendorCategory.find({ category_name: element[6] });
                const dataVendor = {
                  vendor_name: element[1],
                  vendor_code: element[2],
                  address: element[3],
                  phone: element[4],
                  vendor_email: element[5],
                  pic: element[7],
                  pic_phone: element[8],
                  pic_email: element[9],
                  vendor_category: getVendorCategory[0]._id,
                  created_by: createdBy,
                };
                addData = await vendor.create(dataVendor);
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

exports.getVendorByProduct = async (req, res, next) => {
  try {
    const skip = (req.query.pageNumber - 1) * req.query.limit;
    let data;

    if (req.query.search === undefined || req.query.search === null || req.query.search === "") {
      data = await vendor
        .find({ isDelete: false })
        .populate("vendor_category", "-__v")
        .populate({
          path: "products",
          select:"-__v",
          populate: {
            path: "product_category",
            model: "ProductCategory",
          }
        })
        .populate({
          path: "products",
          select:"-__v",
          populate: {
            path: "uom",
            model: "Uom",
          }
        })
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .sort({ $natural: 1 });
    } else {
      data = await vendor
        .find({ isDelete: false })
        .and({ products: req.query.search })

        .populate("vendor_category", "-__v")
        .populate({
          path: "products",
          select:"-__v",
          populate: {
            path: "product_category",
            model: "ProductCategory",
          }
        })
        .populate({
          path: "products",
          select:"-__v",
          populate: {
            path: "uom",
            model: "Uom",
          }
        })
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .sort({ $natural: 1 });
    }
    // console.log(JSON.stringify(data, null, 2))
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