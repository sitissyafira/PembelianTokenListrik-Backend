const ProductBrand = require("./model").ProductBrand;
const ProductCategory = require("../productCategory/model").ProductCategory;
const services = require("../../services/handlerFactory");
const errorHandler = require("../../controllers/errorController");
const excel = require("exceljs");
const fs = require("fs");

exports.create = services.createOne(ProductBrand);
exports.GetById = services.getOne(ProductBrand);
exports.update = services.updateOne(ProductBrand);
exports.delete = services.deleteOne(ProductBrand);

/**
 * @param { page: number, limit: number, search: string  }
 * @description Search param, will search list by category_name.
 */

exports.GetAll = async (req, res, next) => {
  try {
    const skip = (req.query.pageNumber - 1) * req.query.limit;
    let data;
    if (req.query.search === undefined || req.query.search === null || req.query.search === "") {
      data = await ProductBrand.find({ isDelete: false }, {uom: 0})
        .populate({
          path: "product_category",
          model: "ProductCategory",
          select: "-__v",
        })
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .sort({ $natural: 1 });
      allData = await ProductBrand.find({
        isDelete: false,
      });
    } else {
      data = await ProductBrand.find({ isDelete: false }, {uom: 0})
        .and({ brand_name: { $regex: req.query.search } })
        .populate({
          path: "product_category",
          model: "ProductCategory",
          select: "-__v",
        })
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .sort({ $natural: 1 });

      allData = await ProductBrand.find({
        isDelete: false,
      }).and({
        brand_name: {
          $regex: req.query.search,
        },
      });
    }

    res.status(200).json({
      status: "success",
      totalCount: allData.length,
      data: data,
    });
  } catch (error) {
    console.error(error);
    console.log(error);
    return errorHandler(error);
  }
};

exports.getBrandByCategory = async (req, res, next) => {
  try {
    let dataBrand = await ProductBrand.find({ isDelete: false })
      .and({ product_category: req.params.id })
      .lean();

    if (dataBrand) {
      res.status(200).json({
        status: "success",
        data: dataBrand,
      });
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
};

exports.deleteFlag = async (req, res, next) => {
  try {
    const update = {
      isDelete: true,
    };
    const delFlag = await ProductBrand.findByIdAndUpdate(req.params.id, update);
    if (delFlag) {
      res.status(200).json({
        status: "delete success",
      });
    }
  } catch (error) {
    console.error(error);
    console.log(error);
    return errorHandler(error);
  }
};

//export excel
exports.downloadFormatProductBrand = async (req, res, next) => {
  try {
    let workbook = new excel.Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();
    var worksheet = workbook.addWorksheet("Product Brand");
    var worksheetCategory = workbook.addWorksheet("Product Category");

    worksheet.columns = [
      { header: "uniqueid", key: "id", hidden: true },
      { header: "Brand Code", key: "brand_code" },
      { header: "Brand Name", key: "brand_name" },
      { header: "Product Category", key: "product_category" },
      { header: "Description", key: "description" },
      { header: "Status", key: "isDelete" },
    ];

    const data = await ProductBrand.find().populate({
      path: "product_category",
      model: "ProductCategory",
      select: "-__v",
    });
    data.forEach((el) => {
      const row = {
        id: el._id,
        brand_code: el.brand_code,
        brand_name: el.brand_name,
        product_category: el.product_category.category_name,
        description: el.description,
        isDelete: el.isDelete ? "Deleted" : "Active",
      };
      worksheet.addRow(row);
    });

    worksheetCategory.columns = [
      { header: "uniqueid", key: "id", hidden: true },
      { header: "Category Name", key: "category_name" },
    ];
    const productCategory = await ProductCategory.find();
    productCategory.forEach((e) => {
      const rowtype = { id: e._id, category_name: e.category_name };
      worksheetCategory.addRow(rowtype);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats");
    res.setHeader("Content-Disposition", "ataachment; filename=" + "Product_Brand.xlsx");
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  } catch (error) {
    console.error(error);
    console.log(error);
    return errorHandler(error);
  }
};

//import excel
exports.uploadProductBrand = async (req, res, next) => {
  const file = req.file;
  if (file) {
    var workbook = new excel.Workbook();
    let createdBy = req.body.created_by;
    await workbook.xlsx.readFile(`${file.path}`).then(function () {
      workbook.eachSheet(function (sheet, sheetId) {
        if (sheet.name == "Product Brand") {
          var worksheet = workbook.getWorksheet("Product Brand");
          var validated = false;
          worksheet.eachRow(async function (row, rowNumber) {
            if (rowNumber == 1) {
              if (
                row.values[2] == "Brand Code" &&
                row.values[3] == "Brand Name" &&
                row.values[4] == "Product Category" &&
                row.values[5] == "Description"
              ) {
                validated = true;
              }
            } else {
              if (validated) {
                if (row.values[1] !== undefined) {
                  var check = await ProductBrand.findOne({
                    _id: row.values[1].replace(/"+/gi, ""),
                  });
                  if (check) {
                    console.log(check);
                    if (
                      row.values[1] == check._id &&
                      row.values[2] == check.brand_code &&
                      row.values[3] == check.brand_name &&
                      row.values[4] == check.product_category &&
                      row.values[5] == check.description
                    ) {
                    } else {
                      var getCategory = await ProductCategory.find({
                        category_name: row.values[4],
                      });
                      var update = await ProductBrand.findByIdAndUpdate(
                        {
                          _id: row.values[1].replace(/"+/gi, ""),
                        },
                        {
                          brand_code: row.values[2],
                          brand_name: row.values[3],
                          product_category: getCategory[0]._id,
                          description: row.values[5],
                          created_by: createdBy,
                        }
                      );
                    }
                  }
                } else {
                  var getCategory = await ProductCategory.find({ category_name: row.values[4] });
                  var newCust = await ProductBrand.create({
                    brand_code: row.values[2],
                    brand_name: row.values[3],
                    product_category: getCategory[0]._id,
                    description: row.values[5],
                    created_by: createdBy,
                  });
                }
              }
            }
          });
        }
      });
    });
    fs.unlink(`${file.path}`, () => {});
    res.status(200).json({
      status: "TES RESPON",
    });
  } else {
    const error = new Error("please upload your file");
    error.httpStatusCode = 400;
    return next(error);
  }
};
