const ProductCategory = require("./model").ProductCategory;
const services = require("../../services/handlerFactory");
const errorHandler = require("../../controllers/errorController");

exports.create = services.createOne(ProductCategory);
exports.GetById = services.getOne(ProductCategory);
exports.update = services.updateOne(ProductCategory);
exports.delete = services.deleteOne(ProductCategory);

/**
 * @param { page: number, limit: number, search: string  }
 * @description Search param, will search list by category_name.
 */

exports.GetAll = async (req, res, next) => {
  try {
    const skip = (req.query.pageNumber - 1) * req.query.limit;
    let data;
    let allData;

    if (req.query.search === undefined || req.query.search === null || req.query.search === "") {
      data = await ProductCategory.find({ isDelete: false })
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .sort({ $natural: 1 })
        .lean();

      allData = await ProductCategory.find({
        isDelete: false,
      });
    } else {
      data = await ProductCategory.find({
        isDelete: false,
      })
        .and({
          category_name: {
            $regex: req.query.search,
          },
        })
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .sort({ $natural: 1 })
        .lean();

      allData = await ProductCategory.find({
        isDelete: false,
      }).and({
        category_name: {
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

exports.DeleteFlag = async (req, res, next) => {
  try {
    const update = {
      isDelete: true,
    };
    const delFlag = await ProductCategory.findByIdAndUpdate(req.params.id, update);
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
