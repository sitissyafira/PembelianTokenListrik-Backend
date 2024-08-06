const pnltyRate = require("./model");
const servicesFactory = require("../../services/handlerFactory");
const catchAsync = require("../../utils/catchAsync");

exports.create = servicesFactory.createOne(pnltyRate);
exports.getAll = catchAsync(async (req, res, next) => {
  const str = JSON.parse(req.query.param);
  const page = parseInt(str.pageNumber);
  const limit = parseInt(str.limit);
  const skip = (page - 1) * limit;

  let data;

  if (str.filter.rateName.length === 0) {
    data = await pnltyRate.find().skip(skip).limit(limit).sort({ $natural: 1 });
  } else {
    data = await pnltyRate
      .find()
      .or([{ rateName: { $regex: str.filter.rateName } }])
      .skip(skip)
      .limit(limit)
      .sort({ $natural: 1 });
  }
  const allData = await pnltyRate.find();

  res.status(200).json({
    status: "success",
    totalCount: allData.length,
    data,
  });
});
exports.getById = servicesFactory.getOne(pnltyRate, {
  path: "createdBy",
  select: "first_name",
});
exports.update = servicesFactory.updateOne(pnltyRate);
exports.delete = servicesFactory.deleteOne(pnltyRate);
